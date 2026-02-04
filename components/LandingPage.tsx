import React from 'react';
import { Button } from './Button';
import { Logo } from './Logo';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-50 pt-16 pb-20 lg:pt-24 lg:pb-32">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          
          <div className="mb-8 animate-fade-in-down inline-block">
             <span className="bg-white text-green-700 text-xs font-bold px-4 py-1.5 rounded-full border border-green-100 shadow-sm uppercase tracking-wide flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               Nova IA v2.5 Disponível
             </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-stone-900 tracking-tight mb-8 max-w-5xl leading-tight">
            Seu Agrônomo Particular <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">na palma da mão.</span>
          </h1>
          
          <p className="text-xl text-stone-600 max-w-2xl mb-10 leading-relaxed font-light">
            Diagnósticos precisos de saúde vegetal em segundos. Identifique doenças, pragas e carências nutricionais com apenas uma foto.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md relative z-10">
            <Button 
              onClick={onGetStarted} 
              className="text-lg py-4 px-8 rounded-xl shadow-xl shadow-green-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-green-600 hover:bg-green-700 border-none text-white font-bold" 
              fullWidth
            >
              Começar Gratuitamente
            </Button>
          </div>
          <p className="text-xs text-stone-400 mt-4">
              ✨ 3 análises grátis incluídas. Sem cartão de crédito.
          </p>

          {/* New Visual Demo - High Quality Mockup */}
          <div className="mt-20 relative w-full max-w-5xl mx-auto">
             {/* Main Image Container */}
             <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                {/* Background of the mockup */}
                <div className="absolute inset-0 bg-stone-900">
                   <img 
                    src="https://images.unsplash.com/photo-1599687351724-dfa3c4ff81b1?q=80&w=2070&auto=format&fit=crop" 
                    className="w-full h-full object-cover opacity-60"
                    alt="Background Plants"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.classList.add('bg-stone-800');
                    }}
                   />
                </div>
                
                {/* Content Overlay */}
                <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row items-center justify-center gap-12">
                    
                    {/* Floating Phone Mockup Left (Healthy) */}
                    <div className="hidden md:block w-64 bg-white rounded-[2rem] shadow-2xl p-3 rotate-[-6deg] transform hover:rotate-0 transition-all duration-500 group">
                        <div className="relative overflow-hidden rounded-[1.5rem] aspect-[9/16] bg-green-100">
                            <img 
                              src="https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?auto=format&fit=crop&w=600&q=80" 
                              className="w-full h-full object-cover" 
                              alt="Healthy Plant"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }} 
                            />
                        </div>
                        <div className="mt-3 text-center">
                           <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-md">Saudável ✅</span>
                        </div>
                    </div>

                    {/* Center Action Text */}
                    <div className="text-center text-white space-y-4 max-w-xs">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/50 animate-bounce">
                           <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold">Análise Instantânea</h3>
                        <p className="text-stone-300 text-sm">Nossa IA compara sua planta com milhões de amostras em tempo real.</p>
                    </div>

                    {/* Floating Phone Mockup Right (Sick) */}
                    <div className="w-64 bg-white rounded-[2rem] shadow-2xl p-3 md:rotate-[6deg] transform hover:rotate-0 transition-all duration-500 group">
                        <div className="relative overflow-hidden rounded-[1.5rem] aspect-[9/16] bg-yellow-100">
                             <img 
                              src="https://images.unsplash.com/photo-1615214065588-e86641666f7f?auto=format&fit=crop&w=600&q=80" 
                              className="w-full h-full object-cover" 
                              alt="Sick Plant" 
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                        </div>
                         <div className="mt-3 text-center">
                           <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-md">Deficiência de Nitrogênio ⚠️</span>
                        </div>
                    </div>
                </div>
             </div>
             
             {/* Glow Effect behind */}
             <div className="absolute -inset-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-[2.5rem] blur-2xl -z-10 opacity-30"></div>
          </div>

        </div>
      </section>

      {/* How It Works Section - Step by Step */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
               <span className="text-green-600 font-bold tracking-wider uppercase text-sm">Simples e Rápido</span>
               <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mt-2">Como Funciona</h2>
           </div>

           <div className="relative">
              {/* Connecting Line (Desktop) - Adjusted top position to align with circle centers */}
              <div className="hidden md:block absolute top-[6.5rem] left-[16%] right-[16%] h-1 bg-gradient-to-r from-stone-200 via-green-200 to-stone-200 -z-0 rounded-full"></div>

              <div className="grid md:grid-cols-3 gap-8 relative z-10">
                 {/* Step 1 */}
                 <div className="flex flex-col items-center text-center group">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-lg shadow-green-200 z-10 group-hover:scale-110 transition-transform">1</div>
                    
                    <div className="w-24 h-24 bg-white border-4 border-stone-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-stone-100 group-hover:border-green-400 group-hover:scale-110 transition-all duration-300 bg-gradient-to-br from-white to-stone-50">
                        <span className="text-4xl">📸</span>
                    </div>
                    <h3 className="text-xl font-bold text-stone-800 mb-2">Envie a Foto</h3>
                    <p className="text-stone-500 max-w-xs leading-relaxed">
                        Tire uma foto clara da folha ou da planta inteira que apresenta problemas.
                    </p>
                 </div>

                 {/* Step 2 */}
                 <div className="flex flex-col items-center text-center group">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-lg shadow-green-200 z-10 group-hover:scale-110 transition-transform">2</div>

                    <div className="w-24 h-24 bg-white border-4 border-stone-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-stone-100 group-hover:border-green-400 group-hover:scale-110 transition-all duration-300 bg-gradient-to-br from-white to-stone-50">
                        <span className="text-4xl">🤖</span>
                    </div>
                    <h3 className="text-xl font-bold text-stone-800 mb-2">IA Analisa</h3>
                    <p className="text-stone-500 max-w-xs leading-relaxed">
                        Nossa Inteligência Artificial processa a imagem em segundos comparando com milhares de padrões.
                    </p>
                 </div>

                 {/* Step 3 */}
                 <div className="flex flex-col items-center text-center group">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-lg shadow-green-200 z-10 group-hover:scale-110 transition-transform">3</div>

                    <div className="w-24 h-24 bg-white border-4 border-stone-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-stone-100 group-hover:border-green-400 group-hover:scale-110 transition-all duration-300 bg-gradient-to-br from-white to-stone-50">
                        <span className="text-4xl">📝</span>
                    </div>
                    <h3 className="text-xl font-bold text-stone-800 mb-2">Receba o Diagnóstico</h3>
                    <p className="text-stone-500 max-w-xs leading-relaxed">
                        Veja o nome da planta, o problema identificado e as sugestões de tratamento.
                    </p>
                 </div>
              </div>
           </div>
           
           <div className="mt-16 text-center">
             <Button onClick={onGetStarted} className="px-10 py-4 text-lg shadow-xl shadow-green-100 animate-bounce-slow">
                Fazer Diagnóstico Agora
             </Button>
           </div>
        </div>
      </section>

      {/* Features - Fixed Translations */}
      <section className="py-24 bg-stone-50 border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
                <div className="bg-white p-8 rounded-2xl border border-stone-100 hover:border-green-200 hover:shadow-lg transition-all duration-300 group">
                    <div className="w-14 h-14 bg-stone-50 rounded-xl flex items-center justify-center text-green-600 mb-6 text-2xl shadow-sm group-hover:scale-110 transition-transform">🎯</div>
                    <h3 className="text-xl font-bold text-stone-900 mb-3">Diagnóstico Preciso</h3>
                    <p className="text-stone-600 leading-relaxed">
                        Identificamos fungos, bactérias, vírus e deficiências nutricionais com alta confiabilidade.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-stone-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group">
                    <div className="w-14 h-14 bg-stone-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 text-2xl shadow-sm group-hover:scale-110 transition-transform">📚</div>
                    <h3 className="text-xl font-bold text-stone-900 mb-3">Enciclopédia Botânica</h3>
                    <p className="text-stone-600 leading-relaxed">
                         Reconhecimento de milhares de espécies de plantas domésticas, ornamentais e agrícolas.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-stone-100 hover:border-yellow-200 hover:shadow-lg transition-all duration-300 group">
                    <div className="w-14 h-14 bg-stone-50 rounded-xl flex items-center justify-center text-yellow-600 mb-6 text-2xl shadow-sm group-hover:scale-110 transition-transform">💡</div>
                    <h3 className="text-xl font-bold text-stone-900 mb-3">Recomendações Práticas</h3>
                    <p className="text-stone-600 leading-relaxed">
                        Não falamos apenas "grego". Explicamos o que fazer: como regar, onde podar e qual adubo usar.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-stone-100">
          <div className="max-w-6xl mx-auto px-4 text-center">
              <Logo className="h-8 w-auto mx-auto mb-4 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" />
              <div className="flex justify-center space-x-6 mb-8 text-stone-500 text-sm">
                  <a href="#" className="hover:text-green-600">Termos de Uso</a>
                  <a href="#" className="hover:text-green-600">Privacidade</a>
                  <a href="#" className="hover:text-green-600">Suporte</a>
              </div>
              <p className="text-stone-400 text-xs">© 2024 PlantAI. Todos os direitos reservados.</p>
          </div>
      </footer>
    </div>
  );
};