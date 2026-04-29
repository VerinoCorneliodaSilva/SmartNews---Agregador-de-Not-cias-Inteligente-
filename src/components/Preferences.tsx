import React from 'react';
import { UserProfile, UserPreferences } from '../types';
import { Check, Heart } from 'lucide-react';

interface PreferencesProps {
  user: UserProfile;
  onUpdatePreferences: (prefs: UserPreferences) => void;
}

const ALL_CATEGORIES = [
  'Tecnologia',
  'Negócios',
  'Saúde',
  'Ciência',
  'Desporto',
  'Entretenimento'
];

export const Preferences: React.FC<PreferencesProps> = ({
  user,
  onUpdatePreferences
}) => {
  const selectedCategories = user.preferences.categories || [];

  const toggleCategory = (category: string) => {
    let updatedCategories = [...selectedCategories];
    if (updatedCategories.includes(category)) {
      updatedCategories = updatedCategories.filter(c => c !== category);
    } else {
      updatedCategories.push(category);
    }

    onUpdatePreferences({
      ...user.preferences,
      categories: updatedCategories
    });
  };

  const setSummaryLength = (length: 'short' | 'long') => {
    onUpdatePreferences({
      ...user.preferences,
      summaryLength: length
    });
  };

  const setTheme = (theme: 'light' | 'dark') => {
    onUpdatePreferences({
      ...user.preferences,
      theme
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 transition-colors duration-200">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
          <span className="p-2 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Heart className="w-6 h-6" />
          </span>
          <span>Personalize o seu Feed Inteligente</span>
        </h2>
        
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Ajuste as suas preferências para que o algoritmo de IA classifique e recomende conteúdos ajustados aos seus hábitos.
        </p>

        {/* Categorias de Interesse */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Assuntos Favoritos
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Selecione pelo menos um tópico relevante.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ALL_CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex items-center justify-between p-4 border rounded-xl font-semibold transition-all duration-200 ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-400 dark:text-indigo-300'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span>{cat}</span>
                  {isSelected && (
                    <span className="p-1 bg-indigo-600 dark:bg-indigo-400 text-white dark:text-slate-900 rounded-full">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Formato de Resumo IA */}
        <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
            Nível de Detalhe do Resumo IA
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Controla a extensão das descrições automáticas geradas pela IA.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => setSummaryLength('short')}
              className={`flex-1 py-3 border rounded-xl font-semibold transition-all duration-200 ${
                user.preferences.summaryLength === 'short'
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-400 dark:text-indigo-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Curto (Até 2 frases)
            </button>
            <button
              onClick={() => setSummaryLength('long')}
              className={`flex-1 py-3 border rounded-xl font-semibold transition-all duration-200 ${
                user.preferences.summaryLength === 'long'
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-400 dark:text-indigo-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Longo (Até 4 frases)
            </button>
          </div>
        </div>

        {/* Tema */}
        <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
            Modo Visual
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Escolha o ambiente ideal para a sua leitura.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 py-3 border rounded-xl font-semibold transition-all duration-200 ${
                user.preferences.theme === 'light'
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-400 dark:text-indigo-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Modo Claro ☀️
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 py-3 border rounded-xl font-semibold transition-all duration-200 ${
                user.preferences.theme === 'dark'
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-400 dark:text-indigo-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Modo Escuro 🌙
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
