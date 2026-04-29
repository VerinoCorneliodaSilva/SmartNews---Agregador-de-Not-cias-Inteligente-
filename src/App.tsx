import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { NewsCard } from './components/NewsCard';
import { Preferences } from './components/Preferences';
import { AIDashboard } from './components/AIDashboard';
import { Article, UserProfile, UserPreferences } from './types';
import { fetchAllNews } from './utils/newsService';
import { recommendArticles } from './utils/ai';
import { Loader2, Newspaper } from 'lucide-react';

const CATEGORIES = ['Todas', 'Tecnologia', 'Negócios', 'Saúde', 'Ciência', 'Desporto', 'Entretenimento'];

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Load state from localstorage
  useEffect(() => {
    const loggedUser = localStorage.getItem('current_news_user');
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }

    const loadNews = async () => {
      setLoading(true);
      const fetched = await fetchAllNews();
      setArticles(fetched);
      setLoading(false);
    };

    loadNews();
  }, []);

  // Update classes for Dark Mode
  useEffect(() => {
    if (user?.preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user?.preferences.theme]);

  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('current_news_user', JSON.stringify(profile));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('current_news_user');
    setActiveTab('feed');
  };

  const handleUpdatePreferences = (prefs: UserPreferences) => {
    if (!user) return;
    const updatedUser = { ...user, preferences: prefs };
    setUser(updatedUser);
    localStorage.setItem('current_news_user', JSON.stringify(updatedUser));

    // Update the database record
    const storedUsers: UserProfile[] = JSON.parse(localStorage.getItem('news_users') || '[]');
    const index = storedUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      storedUsers[index] = updatedUser;
      localStorage.setItem('news_users', JSON.stringify(storedUsers));
    }
  };

  const handleToggleFavorite = (article: Article) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    const isFav = user.favorites.some(f => f.id === article.id);
    let updatedFavorites = [...user.favorites];

    if (isFav) {
      updatedFavorites = updatedFavorites.filter(f => f.id !== article.id);
    } else {
      updatedFavorites.push(article);
    }

    const updatedUser = { ...user, favorites: updatedFavorites };
    setUser(updatedUser);
    localStorage.setItem('current_news_user', JSON.stringify(updatedUser));

    const storedUsers: UserProfile[] = JSON.parse(localStorage.getItem('news_users') || '[]');
    const index = storedUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      storedUsers[index] = updatedUser;
      localStorage.setItem('news_users', JSON.stringify(storedUsers));
    }
  };

  const handleReadArticle = (article: Article) => {
    if (!user) return;
    
    // Log reading history
    const updatedHistory = [...user.history, article.category];
    const updatedUser = { ...user, history: updatedHistory };
    setUser(updatedUser);
    localStorage.setItem('current_news_user', JSON.stringify(updatedUser));

    const storedUsers: UserProfile[] = JSON.parse(localStorage.getItem('news_users') || '[]');
    const index = storedUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      storedUsers[index] = updatedUser;
      localStorage.setItem('news_users', JSON.stringify(storedUsers));
    }
  };

  // Filter and Recommend articles
  const filteredArticles = articles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const processedArticles = recommendArticles(filteredArticles, user);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Content Areas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-500 font-semibold">A recolher as melhores fontes de informação...</p>
          </div>
        ) : activeTab === 'feed' ? (
          <div>
            {/* Categories scrollbar */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold flex-shrink-0 transition-all ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {processedArticles.length === 0 ? (
              <div className="text-center py-20">
                <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Nenhuma notícia encontrada nesta categoria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {processedArticles.map(article => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    isFavorite={user?.favorites.some(f => f.id === article.id) || false}
                    onToggleFavorite={handleToggleFavorite}
                    onReadArticle={handleReadArticle}
                  />
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'favorites' && user ? (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Artigos Guardados</h2>
            {user.favorites.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-slate-500 font-medium mb-2">Ainda não favoritou nenhum artigo.</p>
                <button
                  onClick={() => setActiveTab('feed')}
                  className="text-sm font-semibold text-indigo-600 hover:underline"
                >
                  Voltar ao Feed
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.favorites.map(article => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    isFavorite={true}
                    onToggleFavorite={handleToggleFavorite}
                    onReadArticle={handleReadArticle}
                  />
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'preferences' && user ? (
          <Preferences user={user} onUpdatePreferences={handleUpdatePreferences} />
        ) : activeTab === 'ai-dashboard' && user ? (
          <AIDashboard user={user} articles={articles} />
        ) : null}
      </main>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
