import React from 'react';
import { useStudy } from '../contexts/StudyContext';
import { Clock, FileText, FolderPlus, Edit3 } from 'lucide-react';

export default function RecentActivity() {
  const { state } = useStudy();

  const getActivityIcon = (type) => {
    switch (type) {
      case 'note_created':
        return FileText;
      case 'note_updated':
        return Edit3;
      case 'category_created':
        return FolderPlus;
      default:
        return FileText;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'note_created':
        return 'text-green-600 bg-green-100';
      case 'note_updated':
        return 'text-blue-600 bg-blue-100';
      case 'category_created':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const activity = new Date(timestamp);
    const diff = now - activity;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </div>

      {state.activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {state.activities.slice(0, 8).map((activity) => {
            const IconComponent = getActivityIcon(activity.type);
            const category = state.categories.find(cat => cat.id === activity.categoryId);
            
            return (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {activity.title}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    {category && (
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color}`}></div>
                        <span className="text-xs text-gray-500">{category.name}</span>
                      </div>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatTime(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {state.activities.length > 8 && (
        <button className="w-full mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
          View All Activity
        </button>
      )}
    </div>
  );
}