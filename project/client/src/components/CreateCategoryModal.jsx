import React, { useState } from 'react';
import { useStudy } from '../contexts/StudyContext';
import { X } from 'lucide-react';
import * as Icons from 'lucide-react';

const availableIcons = [
  'BookOpen', 'Code2', 'Monitor', 'Network', 'Database', 'Smartphone',
  'Globe', 'Shield', 'Zap', 'Cpu', 'Cloud', 'Settings', 'Briefcase',
  'GraduationCap', 'Target', 'Rocket', 'Brain', 'Lightbulb'
];

const availableColors = [
  'from-indigo-500 to-purple-600',
  'from-purple-500 to-pink-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-blue-500 to-indigo-600',
  'from-green-500 to-emerald-600',
  'from-yellow-500 to-orange-600',
  'from-red-500 to-pink-600',
  'from-teal-500 to-cyan-600'
];

export default function CreateCategoryModal({ onClose }) {
  const { addCategory } = useStudy(); // ✅ use API method
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'BookOpen',
    color: 'from-indigo-500 to-purple-600',
    totalTopics: 10
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[MODAL] Submitting category form:', formData);
    setLoading(true);
    setError(null);
    try {
      await addCategory(formData); // persist category via API
      console.log('[MODAL] Category creation attempted');
      onClose();
    } catch (err) {
      console.error('[MODAL] Error creating category', err);
      setError(err.response?.data?.message || err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Create New Category</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Machine Learning"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows="3"
                placeholder="Brief description of this category..."
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Icon
              </label>
              <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                {availableIcons.map((iconName) => {
                  const IconComponent = Icons[iconName];
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: iconName })}
                      className={`p-2 rounded-lg border-2 transition-colors ${
                        formData.icon === iconName
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="h-5 w-5 text-gray-700" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Color
              </label>
              <div className="grid grid-cols-3 gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`h-10 rounded-lg bg-gradient-to-r ${color} border-2 transition-all ${
                      formData.color === color
                        ? 'border-gray-400 scale-105'
                        : 'border-transparent hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Total Topics */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Topics Count
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.totalTopics}
                onChange={(e) =>
                  setFormData({ ...formData, totalTopics: parseInt(e.target.value) || 10 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div
                className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r ${formData.color} text-white`}
              >
                {React.createElement(Icons[formData.icon], { className: 'h-4 w-4' })}
                <span className="font-medium">{formData.name || 'Category Name'}</span>
              </div>
            </div>

            {/* Actions */}
            {error && (
              <div className="text-sm text-red-600 mb-2">{error}</div>
            )}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${loading ? 'bg-gray-400 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              >
                {loading ? 'Creating...' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
