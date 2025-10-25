import React from 'react';
import { useStudy } from '../contexts/StudyContext';
import * as Icons from 'lucide-react';

export default function CategoryCard({ category }) {
  const { state, dispatch } = useStudy();
  
  const IconComponent = Icons[category.icon] || Icons.BookOpen;
  const categoryNotes = state.notes.filter(note => note.category._id === category._id);
  const completionPercentage = category.totalTopics > 0 
    ? Math.round((categoryNotes.length / category.totalTopics) * 100)
    : 0;

  const handleCategoryClick = () => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category._id });
    dispatch({ type: 'SET_VIEW_MODE', payload: 'category' });
  };

  return (
    <div 
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200 overflow-hidden"
      onClick={handleCategoryClick}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${category.color}`}>
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{categoryNotes.length}</div>
            <div className="text-sm text-gray-500">notes</div>
          </div>
        </div>

        {/* Category Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {category.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${category.color} transition-all duration-500`}
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{categoryNotes.length}/{category.totalTopics} topics</span>
          {categoryNotes.length > 0 && (
            <span className="flex items-center">
              <Icons.Clock className="h-4 w-4 mr-1" />
              {new Date(Math.max(...categoryNotes.map(n => new Date(n.updatedAt)))).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-200 rounded-xl transition-colors duration-300"></div>
    </div>
  );
}