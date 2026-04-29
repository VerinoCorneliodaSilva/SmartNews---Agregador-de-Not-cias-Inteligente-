import React, { useState } from 'react';
import { X } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !username)) {
      setError('Por favor preencha todos os campos.');
      return;
    }

    const storedUsers: UserProfile[] = JSON.parse(localStorage.getItem('news_users') || '[]');

    if (isLogin) {
      const user = storedUsers.find(u => u.email === email && u.password === password);
      if (user) {
        // Successful login
        onLoginSuccess(user);
        onClose();
      } else {
        setError('E-mail ou palavra-passe incorretos.');
      }
    } else {
      const userExists = storedUsers.some(u => u.email === email);
      if (userExists) {
        setError('Este e-mail já está em uso.');
        return;
      }

      const newUser: UserProfile = {
        id: crypto.randomUUID(),
        username,
        email,
        password,
        preferences: {
          categories: ['Tecnologia', 'Negócios', 'Saúde'],
          theme: 'light',
          summaryLength: 'short'
        },
        favorites: [],
        history: []
      };

      localStorage.setItem('news_users', JSON.stringify([...storedUsers, newUser]));
      
      onLoginSuccess(newUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 transition-colors duration-200 animate-slide-up">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-2">
          {isLogin ? 'Bem-vindo de volta!' : 'Criar nova conta'}
        </h2>
        <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-6">
          {isLogin ? 'Aceda à sua conta e preferências inteligentes.' : 'Registe-se e configure o seu feed IA personalizado.'}
        </p>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nome de Utilizador
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: joao_silva"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: joao@email.com"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Palavra-passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200"
          >
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          <span>
            {isLogin ? 'Ainda não tem uma conta?' : 'Já possui uma conta?'}
          </span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="ml-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {isLogin ? 'Registe-se' : 'Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
};
