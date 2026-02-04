import React from 'react';
import { MAX_FREE_CREDITS } from '../types';
import { Logo } from './Logo';
import { Button } from './Button';

interface HeaderProps {
  credits: number;
  isPremium: boolean;
  userEmail?: string;
  onUpgradeClick: () => void;
  onHistoryClick: () => void;
  onHomeClick: () => void;
  onProfileClick: () => void;
  onLoginClick: () => void;
  isAuthenticated: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  credits, 
  isPremium, 
  userEmail,
  onUpgradeClick,
  onHistoryClick,
  onHomeClick,
  onProfileClick,
  onLoginClick,
  isAuthenticated
}) => {
  // Defensive: Ensure credits is a number. If NaN or undefined, default to 0 to prevent UI bugs.
  const displayCredits = typeof credits === 'number' ? credits : 0;

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-stone-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={onHomeClick}>
          <Logo className="h-10 w-auto" />
        </div>

        <div className="flex items-center space-x-4">
          
          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Button 
                onClick={onLoginClick}
                variant="ghost"
                className="font-semibold text-stone-600 hover:text-green-700"
              >
                Entrar
              </Button>
              <Button 
                onClick={onLoginClick}
                variant="primary"
                className="hidden sm:inline-flex shadow-lg shadow-green-100"
              >
                Criar Conta
              </Button>
            </div>
          ) : (
            <>
              <button 
                onClick={onHistoryClick} 
                className="text-sm font-medium text-stone-600 hover:text-green-700 hidden sm:block"
              >
                Histórico
              </button>

              {!isPremium && (
                <div className="flex items-center space-x-2">
                    <div className="hidden md:flex flex-col items-end mr-2">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Créditos</span>
                      <span className={`text-sm font-bold ${displayCredits === 0 ? 'text-red-500' : 'text-stone-700'}`}>
                        {displayCredits} / {MAX_FREE_CREDITS}
                      </span>
                    </div>
                    <button
                      onClick={onUpgradeClick}
                      className="hidden sm:block bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                      Premium
                    </button>
                </div>
              )}

              <button 
                onClick={onProfileClick}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-100 border border-stone-200 text-stone-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all shadow-sm"
                title="Meu Perfil"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};