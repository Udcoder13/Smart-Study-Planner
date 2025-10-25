import React from 'react';
import { useStudy } from '../contexts/StudyContext';
import { Plus, Search, BookOpen } from 'lucide-react';

export default function QuickActions({ onCreateCategory }) {
  const { dispatch } = useStudy();

  const logActivity = (type, title) => {
    dispatch({
      type: 'LOG_ACTIVITY',
      payload: {
        type,
        title,
        timestamp: new Date().toISOString()
      }
    });
  };

  const actions = [
    {
      title: 'Create Category',
      description: 'Add a new study category',
      icon: Plus,
      color: 'from-indigo-500 to-purple-600',
      onClick: () => {
        onCreateCategory(); // ✅ From parent (App.jsx)
        logActivity('quick_action', 'Opened create category modal');
      }
    },
    {
      title: 'Browse Notes',
      description: 'View all your notes',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-600',
      onClick: () => {
        dispatch({ type: 'SET_VIEW_MODE', payload: 'notes' });
        logActivity('quick_action', 'Viewed all notes');
      }
    },
    {
      title: 'Search',
      description: 'Find specific notes',
      icon: Search,
      color: 'from-orange-500 to-red-600',
      onClick: () => {
        dispatch({ type: 'SET_VIEW_MODE', payload: 'notes' });
        setTimeout(() => {
          const searchInput = document.querySelector('input[type="search"]');
          if (searchInput) searchInput.focus();
        }, 100);
        logActivity('quick_action', 'Focused on search input');
      }
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map(({ title, description, icon: Icon, color, onClick }) => (
          <button
            key={title}
            onClick={onClick}
            className={`group relative p-4 rounded-lg bg-gradient-to-r ${color} text-white hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
          >
            <div className="flex items-center space-x-3">
              <Icon className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">{title}</div>
                <div className="text-sm opacity-90">{description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
