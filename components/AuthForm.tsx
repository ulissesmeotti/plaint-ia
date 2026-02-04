import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Button } from './Button';
import { Logo } from './Logo';

export const AuthForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Login Flow
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // The onAuthStateChange in App.tsx handles the redirection
      } else {
        // Signup Flow
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;

        // Se a confirmação de email estiver DESATIVADA no Supabase, data.session existirá.
        // Se estiver ATIVADA, data.session será null.
        if (data.session) {
          onSuccess();
        } else {
          // Caso o usuário não tenha desativado a opção no painel, tentamos logar manualmente
          // Se falhar aqui, é porque a configuração 'Confirm Email' ainda está ativa no Supabase
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (signInError) {
             if (signInError.message.includes("Email not confirmed")) {
                 throw new Error("Acesse o painel do Supabase > Auth > Providers > Email e desative 'Confirm email' para pular a verificação.");
             }
             throw signInError;
          }
        }
      }
      // Success is largely handled by the AuthStateChange listener in App.tsx, 
      // but we call onSuccess to be sure specifically for Sign Up flow transition.
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <Logo className="h-12 w-auto" />
          </div>
          
          <h2 className="text-2xl font-bold text-stone-800 text-center mb-2">
            {isLogin ? 'Bem-vindo de volta' : 'Criar conta rápida'}
          </h2>
          <p className="text-stone-500 text-center mb-8 text-sm">
            {isLogin ? 'Acesse seu histórico e créditos.' : 'Preencha para começar a analisar.'}
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar e Entrar')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
              }}
              className="text-sm text-stone-600 hover:text-green-600 transition-colors"
            >
              {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entrar'}
            </button>
          </div>
        </div>
        <div className="bg-stone-50 py-4 text-center text-xs text-stone-400 border-t border-stone-100">
            Acesso seguro via Supabase
        </div>
      </div>
    </div>
  );
};