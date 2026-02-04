import React, { useEffect, useState } from 'react';

export const ScanningOverlay: React.FC<{ imageUrl: string | null }> = ({ imageUrl }) => {
  const [step, setStep] = useState(0);
  const steps = [
    "Identificando espécie...",
    "Mapeando estrutura foliar...",
    "Detectando patógenos...",
    "Verificando sinais de estresse...",
    "Compilando diagnóstico..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500); // Change text every 1.5s
    return () => clearInterval(interval);
  }, []);

  if (!imageUrl) return null;

  return (
    <div className="absolute inset-0 z-50 bg-stone-900/90 backdrop-blur-md flex flex-col items-center justify-center rounded-3xl overflow-hidden">
      {/* Scanner Visual */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8">
        {/* The Image being scanned */}
        <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-stone-700 shadow-2xl">
            <img src={imageUrl} className="w-full h-full object-cover opacity-60 grayscale" alt="Scanning" />
        </div>
        
        {/* Rotating Radar */}
        <div className="absolute inset-0 rounded-full border-t-4 border-green-500 animate-spin" style={{ animationDuration: '2s' }}></div>
        <div className="absolute inset-2 rounded-full border-b-4 border-emerald-400 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
        
        {/* Scanning Line */}
        <div className="absolute inset-0 w-full h-1 bg-green-500/80 shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-[scan_2s_ease-in-out_infinite] top-0"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px)] bg-[size:20px_20px] rounded-full"></div>
      </div>

      {/* Text Status */}
      <div className="flex flex-col items-center">
        <h3 className="text-2xl font-bold text-white mb-2 tracking-wider">ANALISANDO</h3>
        <div className="h-6 overflow-hidden relative w-64 text-center">
             <p key={step} className="text-green-400 font-mono text-sm animate-fade-in-up">
               {steps[step]}
             </p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-64 h-1 bg-stone-700 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-green-500 animate-[progress_6s_ease-in-out_forwards] w-0"></div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};