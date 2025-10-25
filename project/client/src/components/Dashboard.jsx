import React from 'react';
import { useStudy } from '../contexts/StudyContext';
import CategoryCard from './CategoryCard';
import RecentActivity from './RecentActivity';
import StatsOverview from './StatsOverview';
import AISuggestions from './AISuggestions';
import QuickActions from './QuickActions';

export default function Dashboard({ onCreateCategory }) {
  const { state } = useStudy();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Overview */}
      <StatsOverview />

      {/* Quick Actions */}
      <QuickActions onCreateCategory={onCreateCategory} />

      {/* Study Categories */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Study Categories</h2>
          <span className="text-sm text-gray-500">
            {state.categories.length} {state.categories.length === 1 ? 'category' : 'categories'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.categories.map((category) => (
            <CategoryCard key={category._id || category.id} category={category} />
          ))}
        </div>
      </div>

      {/* AI Suggestions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AISuggestions />
        <RecentActivity />
      </div>
    </div>
  );
}
