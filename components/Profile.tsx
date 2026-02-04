import React from 'react';
import { Button } from './Button';
import { UserState, MAX_FREE_CREDITS } from '../types';

interface ProfileProps {
  userEmail: string;
  userState: UserState;
  onLogout: () => void;
  onUpgrade: () => void;
  onBack: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ userEmail, userState, onLogout, onUpgrade, onBack }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-6">
        <button onClick={onBack} className="text-stone-500 hover:text-green-700 font-medium text-sm flex items-center">
             ← Voltar
        </button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden">
        <div className="bg-gradient-to-r from-stone-800 to-stone-900 px-8 py-10 text-white">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-green-500 flex items-center justify-center text-3xl font-bold shadow-xl border-4 border-stone-800">
               {userEmail.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{userEmail.split('@')[0]}</h1>
              <p className="text-stone-400 text-sm">{userEmail}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid gap-6">
            <div className="bg-stone-50 p-6 rounded-xl border border-stone-100 flex justify-between items-center">
              <div>
                <p className="text-stone-500 text-sm font-medium uppercase tracking-wide">Plano Atual</p>
                <p className={`text-xl font-bold ${userState.isPremium ? 'text-green-600' : 'text-stone-800'}`}>
                  {userState.isPremium ? 'Premium (Ilimitado)' : 'Gratuito'}
                </p>
              </div>
              {!userState.isPremium && (
                <Button onClick={onUpgrade} variant="primary" className="shadow-md">
                  Upgrade
                </Button>
              )}
            </div>

            <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
               <div className="flex justify-between items-end mb-2">
                 <p className="text-stone-500 text-sm font-medium uppercase tracking-wide">Créditos de Análise</p>
                 <span className="text-stone-900 font-bold">
                    {userState.isPremium ? '∞' : `${userState.credits} / ${MAX_FREE_CREDITS}`}
                 </span>
               </div>
               {!userState.isPremium && (
                 <div className="w-full bg-stone-200 rounded-full h-2.5">
                   <div 
                      className={`h-2.5 rounded-full ${userState.credits > 0 ? 'bg-green-500' : 'bg-red-500'}`} 
                      style={{ width: `${(userState.credits / MAX_FREE_CREDITS) * 100}%` }}
                    ></div>
                 </div>
               )}
               {userState.isPremium && (
                   <div className="flex items-center text-green-600 text-sm mt-2">
                       <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                       Análises ilimitadas ativas
                   </div>
               )}
            </div>

            <div className="border-t border-stone-100 pt-6 mt-2">
              <h3 className="text-stone-800 font-bold mb-4">Configurações da Conta</h3>
              <Button onClick={onLogout} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                Sair da Conta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
