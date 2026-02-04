import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import { userService } from './services/userService';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { AnalysisResult } from './components/AnalysisResult';
import { UpgradeModal } from './components/UpgradeModal';
import { Button } from './components/Button';
import { LandingPage } from './components/LandingPage';
import { AuthForm } from './components/AuthForm';
import { Profile } from './components/Profile';
import { ScanningOverlay } from './components/ScanningOverlay'; // Import Overlay
import { analyzePlantImage, fileToBase64 } from './services/geminiService';
import { AppView, MAX_FREE_CREDITS, PlantAnalysis, UserState } from './types';

const INITIAL_STATE: UserState = {
  credits: MAX_FREE_CREDITS,
  isPremium: false,
  analyses: []
};

function App() {
  // Auth State
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App State
  const [userState, setUserState] = useState<UserState>(INITIAL_STATE);
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  
  // Operation State
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<PlantAnalysis | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // To show in loading
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveWarning, setSaveWarning] = useState<string | null>(null);

  // 1. Check Auth on Mount & Load Data
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadUserData(session.user);
        setCurrentView(AppView.DASHBOARD);
      }
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
         loadUserData(session.user);
         // Redirect to dashboard if on landing/auth pages after login
         if (currentView === AppView.LANDING || currentView === AppView.AUTH) {
            setCurrentView(AppView.DASHBOARD);
         }
      } else {
         setCurrentView(AppView.LANDING);
         setUserState(INITIAL_STATE);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (user: any) => {
    const data = await userService.getOrCreateProfile(user);
    setUserState(data);
  };

  // Helper to get User Name safely
  const getUserName = () => {
    if (!session || !session.user) return 'Amante de Plantas';
    if (session.user.user_metadata && session.user.user_metadata.full_name) {
        return session.user.user_metadata.full_name;
    }
    if (session.user.email) {
        return session.user.email.split('@')[0];
    }
    return 'Amante de Plantas';
  };

  // Handlers
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentView(AppView.LANDING);
  };

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    setSaveWarning(null);
  };

  const handleAnalyzeClick = async () => {
    if (!selectedFile || !session?.user) return;

    // Check credits
    if (!userState.isPremium && userState.credits <= 0) {
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSaveWarning(null);

    try {
      // 1. Prepare Image
      // NOTE: fileToBase64 now converts everything to JPEG automatically
      const base64 = await fileToBase64(selectedFile);
      const mimeType = 'image/jpeg'; // Hardcoded because conversion guarantees JPEG

      // 2. Call Gemini API
      const resultText = await analyzePlantImage(base64, mimeType);

      // 3. Prepare Result Object
      const imageUrl = `data:${mimeType};base64,${base64}`; 
      
      const newAnalysis: PlantAnalysis = {
        id: Date.now().toString(),
        imageUrl: imageUrl,
        rawText: resultText,
        timestamp: Date.now()
      };

      // 4. Try to Save to DB (Non-blocking)
      // If the profile is missing or DB is down, we still want to show the result.
      let saveSuccessful = false;
      try {
        await userService.saveAnalysis(session.user.id, resultText, imageUrl);
        saveSuccessful = true;
      } catch (saveError: any) {
        console.warn("Could not save analysis history:", saveError);
        setSaveWarning("A análise foi concluída, mas não foi possível salvá-la no seu histórico permanente.");
      }

      // 5. Update Local State
      setUserState(prev => {
        const updatedAnalyses = [newAnalysis, ...prev.analyses];
        // Recalculate credits based on the new count
        const usedCredits = updatedAnalyses.length;
        const remainingCredits = Math.max(0, MAX_FREE_CREDITS - usedCredits);

        return {
          ...prev,
          credits: prev.isPremium ? prev.credits : remainingCredits,
          analyses: updatedAnalyses
        };
      });

      setCurrentAnalysis(newAnalysis);
      setCurrentView(AppView.ANALYSIS);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Não foi possível analisar a planta. Verifique sua conexão e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeConfirm = async () => {
    if(!session?.user) return;
    
    // Simulate payment
    setTimeout(async () => {
      await userService.upgradeToPremium(session.user.id);
      setUserState(prev => ({ ...prev, isPremium: true }));
      setIsUpgradeModalOpen(false);
      alert("Parabéns! Você agora é Premium!");
    }, 1000);
  };

  const resetFlow = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCurrentAnalysis(null);
    setSaveWarning(null);
    setCurrentView(AppView.DASHBOARD);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // --- Render Helpers ---

  const renderDashboard = () => (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold text-stone-800 mb-3 tracking-tight">
          Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 capitalize">{getUserName()}</span>!
        </h1>
        <p className="text-stone-500 text-lg">Suas plantas estão precisando de um check-up hoje?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start relative">
        
        {/* Left Column: Action Area */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-stone-200/50 p-8 border border-stone-100 relative overflow-hidden min-h-[500px] flex flex-col justify-center">
          
          {/* Overlay for Loading */}
          {isLoading && <ScanningOverlay imageUrl={previewUrl} />}

          <div className="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-bl-full -mr-10 -mt-10 opacity-60 pointer-events-none"></div>
          
          <div className="relative z-10 w-full">
            <h2 className="text-2xl font-bold text-stone-800 mb-8 flex items-center">
              <span className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mr-4 text-base font-bold shadow-sm">1</span>
              Upload da Planta
            </h2>
            
            <ImageUpload onImageSelected={handleImageSelect} isLoading={isLoading} />
            
            {selectedFile && !isLoading && (
              <div className="mt-8 animate-fade-in-up">
                 <h2 className="text-2xl font-bold text-stone-800 mb-4 flex items-center">
                  <span className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mr-4 text-base font-bold shadow-sm">2</span>
                  Iniciar Diagnóstico
                </h2>
                <Button 
                  onClick={handleAnalyzeClick} 
                  fullWidth
                  className="text-lg py-4 rounded-xl shadow-lg shadow-green-200 transform hover:-translate-y-1 transition-all bg-gradient-to-r from-green-600 to-emerald-600 border-none"
                >
                  Analisar Agora ✨
                </Button>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl text-center border border-red-100 text-sm font-medium">
                ⚠️ {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Visual Simulation / "How it works" */}
        <div className="hidden md:block sticky top-24">
           <div className="bg-stone-900 rounded-[2.5rem] border-[10px] border-stone-900 shadow-2xl overflow-hidden max-w-[380px] mx-auto relative transform rotate-1 hover:rotate-0 transition-transform duration-700 ease-out">
             {/* Phone Screen Mockup */}
             <div className="bg-stone-50 h-[700px] w-full relative overflow-hidden flex flex-col">
                {/* Status Bar */}
                <div className="h-7 bg-stone-900 flex justify-between px-6 items-center">
                   <div className="text-[10px] text-white font-medium">10:00</div>
                   <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-white rounded-full opacity-30"></div>
                      <div className="w-3 h-3 bg-white rounded-full opacity-30"></div>
                   </div>
                </div>
                
                {/* App Content Simulation */}
                <div className="p-6 flex-1 overflow-hidden relative bg-gradient-to-b from-stone-50 to-white">
                   <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
                           <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div>
                          <div className="h-2.5 w-24 bg-stone-200 rounded-full mb-2"></div>
                          <div className="h-2 w-16 bg-stone-100 rounded-full"></div>
                        </div>
                   </div>

                   {/* Simulated Result Card */}
                   <div className="bg-white p-4 rounded-2xl shadow-lg border border-stone-100 mb-6 transform transition-all hover:scale-[1.02]">
                       <div className="relative h-40 bg-stone-200 rounded-xl mb-4 overflow-hidden group">
                          {/* UPDATED IMAGE HERE */}
                          <img src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover" alt="Monstera Deliciosa" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                          <span className="absolute bottom-3 left-3 text-white font-bold text-sm">Monstera Deliciosa</span>
                       </div>
                       
                       <div className="space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-stone-50">
                             <span className="text-xs text-stone-400 font-medium uppercase">Saúde</span>
                             <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">98% Excelente</span>
                          </div>
                          <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                             <div className="h-full bg-green-500 w-[98%]"></div>
                          </div>
                       </div>
                   </div>

                   {/* Simulated Actions */}
                   <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                         <div className="text-xl mb-1">💧</div>
                         <div className="text-[10px] text-blue-800 font-bold">Rega: Moderada</div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                         <div className="text-xl mb-1">☀️</div>
                         <div className="text-[10px] text-yellow-800 font-bold">Luz: Indireta</div>
                      </div>
                   </div>
                </div>

                {/* Bottom Bar */}
                <div className="h-20 bg-white border-t border-stone-100 flex justify-around items-center px-6 relative z-20 pb-4">
                   <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                   </div>
                   <div className="w-12 h-12 -mt-8 rounded-full bg-stone-900 shadow-lg shadow-stone-300 flex items-center justify-center text-white">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-stone-50 text-stone-400 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                   </div>
                </div>
             </div>
           </div>
           <p className="text-center text-stone-400 text-xs mt-8 font-medium tracking-wide uppercase">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <Header 
        credits={userState.credits}
        isPremium={userState.isPremium}
        userEmail={session?.user?.email}
        isAuthenticated={!!session}
        onUpgradeClick={() => setIsUpgradeModalOpen(true)}
        onHistoryClick={() => setCurrentView(AppView.PROFILE)} 
        onHomeClick={() => setCurrentView(session ? AppView.DASHBOARD : AppView.LANDING)}
        onProfileClick={() => setCurrentView(AppView.PROFILE)}
        onLoginClick={() => setCurrentView(AppView.AUTH)}
      />

      <main>
        {currentView === AppView.LANDING && (
          <LandingPage onGetStarted={() => {
            if (session) setCurrentView(AppView.DASHBOARD);
            else setCurrentView(AppView.AUTH);
          }} />
        )}

        {currentView === AppView.AUTH && (
          <AuthForm onSuccess={() => setCurrentView(AppView.DASHBOARD)} />
        )}

        {currentView === AppView.DASHBOARD && renderDashboard()}

        {currentView === AppView.ANALYSIS && currentAnalysis && (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <Button variant="ghost" onClick={resetFlow} className="mb-4">← Voltar para Dashboard</Button>
                
                {saveWarning && (
                  <div className="mb-6 p-4 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-200 flex items-center">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-sm">{saveWarning}</span>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <div className="rounded-xl overflow-hidden shadow-lg border border-stone-200 sticky top-24">
                            <img src={currentAnalysis.imageUrl} alt="Analysed Plant" className="w-full h-auto" />
                        </div>
                    </div>
                    <div>
                        <AnalysisResult text={currentAnalysis.rawText} />
                    </div>
                </div>
            </div>
        )}

        {currentView === AppView.PROFILE && session && (
            <Profile 
                userEmail={session.user.email} 
                userState={userState}
                onLogout={handleLogout}
                onUpgrade={() => setIsUpgradeModalOpen(true)}
                onBack={() => setCurrentView(AppView.DASHBOARD)}
            />
        )}
      </main>

      <UpgradeModal 
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onConfirm={handleUpgradeConfirm}
      />
    </div>
  );
}

export default App;