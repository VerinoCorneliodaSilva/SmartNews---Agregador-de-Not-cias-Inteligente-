import React, { useState } from 'react';
import { Heart, Sparkles, ExternalLink } from 'lucide-react';
import { Article } from '../types';
import { generateAISummary } from '../utils/ai';

interface NewsCardProps {
  article: Article;
  isFavorite: boolean;
  onToggleFavorite: (article: Article) => void;
  onReadArticle: (article: Article) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  isFavorite,
  onToggleFavorite,
  onReadArticle
}) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleSummarize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSummarizing(true);
    setTimeout(() => {
      setSummary(generateAISummary(article));
      setIsSummarizing(false);
      onReadArticle(article);
    }, 800);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Data recente';
    }
  };

  const sentimentColors = {
    Positivo: 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400 border-green-200 dark:border-green-800',
    Neutro: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    Negativo: 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800'
  };

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      
      {/* Image with Tag */}
      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={article.urlToImage}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
          <span className="px-3 py-1 bg-indigo-600/90 text-white text-xs font-bold rounded-full shadow-md backdrop-blur-sm">
            {article.category}
          </span>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border shadow-md backdrop-blur-sm ${sentimentColors[article.sentiment]}`}>
            {article.sentiment}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(article); }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm shadow-md transition-colors ${
            isFavorite 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <span className="text-xs text-indigo-500 dark:text-indigo-400 font-semibold tracking-wider">
            {article.source.name}
          </span>
          <h3 className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug">
            {article.title}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
            {article.description}
          </p>

          {/* AI Summary View */}
          {summary && (
            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50 rounded-xl animate-fade-in">
              <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold text-xs mb-1">
                <Sparkles className="w-3 h-3 mr-1" />
                Resumo por Inteligência Artificial
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                {summary}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {formatDate(article.publishedAt)}
          </span>

          <div className="flex space-x-1">
            {!summary && (
              <button
                onClick={handleSummarize}
                disabled={isSummarizing}
                className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg transition-colors"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isSummarizing ? 'animate-spin' : ''}`} />
                <span>{isSummarizing ? 'A ler...' : 'Resumir IA'}</span>
              </button>
            )}

            <a
              href={article.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => onReadArticle(article)}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              <span>Ler Mais</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
