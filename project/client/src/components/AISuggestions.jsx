import React from 'react';
import { useStudy } from '../contexts/StudyContext';
import { Sparkles, ChevronRight, BookOpen, RotateCcw, Lightbulb } from 'lucide-react';

export default function AISuggestions() {
  const { state, dispatch } = useStudy();

  const getIcon = (type) => {
    switch (type) {
      case 'next_topic':
        return ChevronRight;
      case 'review':
        return RotateCcw;
      case 'concept_explanation':
        return Lightbulb;
      default:
        return BookOpen;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50 text-red-700';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 text-yellow-700';
      case 'low':
        return 'border-green-200 bg-green-50 text-green-700';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Navigate to the suggested category
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: suggestion.categoryId });
    dispatch({ type: 'SET_VIEW_MODE', payload: 'category' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">AI Suggestions</h2>
      </div>

      {state.suggestions.length === 0 ? (
        <div className="text-center py-8">
          <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Start taking notes to get AI-powered suggestions!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {state.suggestions.map((suggestion) => {
            const IconComponent = getIcon(suggestion.type);
            const category = state.categories.find(cat => cat.id === suggestion.categoryId);
            
            return (
              <div
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                    <IconComponent className="h-4 w-4 text-indigo-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-900">
                        {suggestion.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(suggestion.priority)}`}>
                        {suggestion.priority}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                    
                    {category && (
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color}`}></div>
                        <span className="text-xs text-gray-500">{category.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {state.suggestions.length > 0 && (
        <button
          onClick={() => dispatch({ type: 'GENERATE_AI_SUGGESTIONS' })}
          className="w-full mt-4 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200 font-medium"
        >
          Refresh Suggestions
        </button>
      )}
    </div>
  );
}