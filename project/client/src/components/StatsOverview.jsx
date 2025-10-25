import React from 'react';
import { useStudy } from '../contexts/StudyContext';
import { BookOpen, Target, Zap, TrendingUp } from 'lucide-react';

export default function StatsOverview() {
  const { state } = useStudy();

  const totalNotes = state.notes.length;
  const bookmarkedNotes = state.notes.filter(note => note.isBookmarked).length;
  const categoriesWithNotes = state.categories.filter(cat => 
    state.notes.some(note => {
      const noteCat = note.category;
      if (!noteCat) return false;
      const noteCatId = noteCat._id || noteCat.id || noteCat;
      const catId = cat._id || cat.id || cat;
      return String(noteCatId) === String(catId);
    })
  ).length;
  
  // Calculate average progress across categories
  const avgProgress = (() => {
  if (!state.categories.length || !state.notes.length) return 0;

  let totalTopics = 0;
  let totalCompleted = 0;

  state.categories.forEach(cat => {
    const notesForCategory = state.notes.filter(note => {
      const noteCat = note.category;
      if (!noteCat) return false;
      const noteCatId = noteCat._id || noteCat.id || noteCat;
      const catId = cat._id || cat.id || cat;
      return String(noteCatId) === String(catId);
    });

    totalTopics += cat.totalTopics || 0;
    totalCompleted += notesForCategory.length;
  });

  return totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;
})();


  const stats = [
    {
      title: 'Total Notes',
      value: totalNotes,
      icon: BookOpen,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      title: 'Bookmarked',
      value: bookmarkedNotes,
      icon: Target,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Active Categories',
      value: categoriesWithNotes,
      icon: Zap,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Avg Progress',
      value: `${avgProgress}%`,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div 
            key={stat.title}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <IconComponent className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
            
            {/* Progress bar for visual appeal */}
            <div className="mt-4">
              <div className="w-full bg-gray-100 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000`}
                  style={{ 
                    width: stat.title === 'Avg Progress' ? `${avgProgress}%` : '100%',
                    animationDelay: `${index * 200}ms`
                  }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}