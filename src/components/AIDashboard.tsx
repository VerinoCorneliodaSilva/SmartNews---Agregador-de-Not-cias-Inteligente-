import React from 'react';
import { Article, UserProfile } from '../types';
import { Sparkles, PieChart, BarChart2, Smile } from 'lucide-react';

interface AIDashboardProps {
  user: UserProfile;
  articles: Article[];
}

export const AIDashboard: React.FC<AIDashboardProps> = ({
  user,
  articles
}) => {
  // 1. Calculate reading counts per category
  const categoryCounts: { [key: string]: number } = {};
  user.history.forEach(cat => {
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // 2. Calculate sentiment proportions
  const sentimentCounts = { Positivo: 0, Neutro: 0, Negativo: 0 };
  articles.forEach(art => {
    sentimentCounts[art.sentiment] = (sentimentCounts[art.sentiment] || 0) + 1;
  });

  const totalArticles = articles.length || 1;
  const sentimentPercentages = {
    Positivo: Math.round((sentimentCounts.Positivo / totalArticles) * 100),
    Neutro: Math.round((sentimentCounts.Neutro / totalArticles) * 100),
    Negativo: Math.round((sentimentCounts.Negativo / totalArticles) * 100),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-purple-600 text-white p-3 rounded-2xl shadow-md">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            Painel de Inteligência Artificial
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Saiba o que a nossa IA aprendeu sobre o seu perfil de leitura.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 font-bold text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <BarChart2 className="w-5 h-5 text-indigo-500" />
            <span>Tópicos Mais Acedidos</span>
          </div>
          
          {topCategories.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
              Ainda não há dados suficientes. Continue a ler artigos para mapear gostos.
            </p>
          ) : (
            <div className="space-y-4">
              {topCategories.map(([category, count]) => (
                <div key={category}>
                  <div className="flex justify-between text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>{category}</span>
                    <span>{count} {count === 1 ? 'leitura' : 'leituras'}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((count / user.history.length) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 font-bold text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <PieChart className="w-5 h-5 text-purple-500" />
            <span>Clima das Notícias Atuais</span>
          </div>

          <div className="space-y-4">
            {/* Positivo */}
            <div>
              <div className="flex justify-between text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center">
                  <Smile className="w-4 h-4 text-green-500 mr-1" />
                  Positivo
                </span>
                <span>{sentimentPercentages.Positivo}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-green-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${sentimentPercentages.Positivo}%` }}
                />
              </div>
            </div>

            {/* Neutro */}
            <div>
              <div className="flex justify-between text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Neutro</span>
                <span>{sentimentPercentages.Neutro}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-slate-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${sentimentPercentages.Neutro}%` }}
                />
              </div>
            </div>

            {/* Negativo */}
            <div>
              <div className="flex justify-between text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Negativo</span>
                <span>{sentimentPercentages.Negativo}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-red-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${sentimentPercentages.Negativo}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-6 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 rounded-2xl p-6 text-slate-700 dark:text-slate-300">
        <h4 className="font-bold flex items-center text-purple-700 dark:text-purple-400 mb-2">
          <Sparkles className="w-4 h-4 mr-1 text-purple-500" />
          Recomendação IA ativa
        </h4>
        <p className="text-sm">
          A sua ordem de visualização está a ser recalculada dinamicamente. Os artigos que correspondem à sua editoria favorita estão a ser promovidos ao topo do feed principal.
        </p>
      </div>
    </div>
  );
};
