import React from 'react';
import { useStudy } from '../contexts/StudyContext';
import { Brain, Home, BookOpen } from 'lucide-react';

export default function Header({ onLogout }) {
  const { state, dispatch } = useStudy();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'notes', label: 'All Notes', icon: BookOpen },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Smart Study Manager</h1>
              <p className="text-xs text-gray-500">AI-Powered Learning</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = state.viewMode === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: item.id })}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span>{state.notes.length} notes</span>
              <span>•</span>
              <span>{state.categories.length} categories</span>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="text-sm bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
