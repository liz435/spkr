import { useState } from 'react';

interface HeaderProps {
  onSettingsToggle?: () => void;
  onThemeToggle?: () => void;
  onNotificationToggle?: () => void;
}

export default function Header({ 
  onSettingsToggle,
  onThemeToggle,
  onNotificationToggle 
}: HeaderProps = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  return (
    <header className="bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-xl border-b border-gray-700">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SPKR Dashboard
            </h1>
            <p className="text-xs text-gray-400">Audio Control Center</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
            Home
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
            Analytics
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
            Presets
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
            Help
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button
            onClick={onNotificationToggle}
            className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-gray-700 rounded-lg"
            title="Notifications"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.5a6 6 0 0 1 5.5 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 2 15.5v-7a6 6 0 0 1 5.5-5.5h3z" />
            </svg>
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-gray-700 rounded-lg"
            title="Toggle Theme"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          {/* Settings */}
          <button
            onClick={onSettingsToggle}
            className="p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-gray-700 rounded-lg"
            title="Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-gray-700 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <nav className="p-4 space-y-2">
            <a href="#" className="block py-2 px-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors duration-200">
              Home
            </a>
            <a href="#" className="block py-2 px-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors duration-200">
              Analytics
            </a>
            <a href="#" className="block py-2 px-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors duration-200">
              Presets
            </a>
            <a href="#" className="block py-2 px-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors duration-200">
              Help
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}