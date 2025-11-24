import { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  User,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { useStore, useUnacknowledgedAlerts } from '../../store/useStore';
import clsx from 'clsx';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { darkMode, toggleDarkMode, updateFilters, initializeData } = useStore();
  const unacknowledgedAlerts = useUnacknowledgedAlerts();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ searchQuery });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    initializeData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <header className="h-16 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border flex items-center justify-between px-6">
      {/* Title */}
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search shipments, containers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 w-64"
          />
        </form>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
          title="Refresh data"
        >
          <RefreshCw
            className={clsx(
              'w-5 h-5 text-gray-500 dark:text-gray-400',
              isRefreshing && 'animate-spin'
            )}
          />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border transition-colors">
          <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          {unacknowledgedAlerts.length > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unacknowledgedAlerts.length > 9 ? '9+' : unacknowledgedAlerts.length}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>

        {/* User Menu */}
        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border transition-colors">
          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Admin
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </header>
  );
}
