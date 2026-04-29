import React from 'react';
import { Search, Heart, User, Sparkles, LogOut, Sliders } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onLogout,
  onOpenAuth
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => setActiveTab('feed')}
          >
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-indigo-600 dark:text-indigo-400">
              SmartNews
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar notícias..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-0 rounded-full focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Nav Items */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'feed'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Feed
            </button>

            {user && (
              <>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'favorites'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Heart className="w-4 h-4 mr-1 text-red-500" />
                  Favoritos
                </button>

                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'preferences'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Sliders className="w-4 h-4 mr-1 text-indigo-500" />
                  Personalizar
                </button>

                <button
                  onClick={() => setActiveTab('ai-dashboard')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'ai-dashboard'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="w-4 h-4 mr-1 text-purple-500" />
                  IA Dashboard
                </button>
              </>
            )}

            {user ? (
              <div className="flex items-center border-l pl-4 border-slate-200 dark:border-slate-700 ml-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 mr-3 hidden md:inline">
                  {user.username}
                </span>
                <button
                  onClick={onLogout}
                  title="Sair"
                  className="p-2 text-slate-500 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md"
              >
                <User className="w-4 h-4 mr-1" />
                <span>Entrar</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-3 px-2 sm:hidden flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar notícias..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-0 rounded-full focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 text-sm"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
