import React from 'react';
import { Button } from './Button';
import { PREMIUM_PRICE } from '../types';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100">
        <div className="relative h-32 bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md mb-2">
               <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">BioPlant AI <span className="text-yellow-300">Premium</span></h2>
          </div>
        </div>
        
        <div className="p-8">
          <p className="text-stone-600 text-center mb-6">
            Você atingiu o limite de análises gratuitas. Desbloqueie todo o potencial e cuide melhor das suas plantas!
          </p>
          
          <div className="space-y-3 mb-8">
            <div className="flex items-center text-stone-700">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Análises Ilimitadas
            </div>
            <div className="flex items-center text-stone-700">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Diagnósticos Detalhados
            </div>
            <div className="flex items-center text-stone-700">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Prioridade no Processamento
            </div>
            <div className="flex items-center text-stone-700">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Acesso ao Histórico Completo
            </div>
          </div>

          <div className="text-center mb-6">
            <span className="text-3xl font-bold text-stone-900">{PREMIUM_PRICE}</span>
            <span className="text-stone-500"> / mês</span>
          </div>

          <Button 
            variant="primary" 
            fullWidth 
            onClick={onConfirm}
            className="text-lg py-3 shadow-lg shadow-green-200"
          >
            Assinar Agora
          </Button>
          <p className="text-xs text-center text-stone-400 mt-4">Cancele quando quiser.</p>
        </div>
      </div>
    </div>
  );
};
