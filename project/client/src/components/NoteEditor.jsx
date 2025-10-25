import React, { useState, useEffect } from 'react';
import { X, Save, Star, Tag, Eye, Edit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function NoteEditor({ note, category, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    isBookmarked: false
  });
  const [tagInput, setTagInput] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        tags: note.tags,
        isBookmarked: note.isBookmarked
      });
    }
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      category: category._id
    };
    if (onSubmit) {
      await onSubmit(payload);
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, trimmedTag]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {note ? 'Edit Note' : 'Create New Note'}
            </h2>
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
              {category.name}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className={`p-2 rounded-lg transition-colors ${
                isPreview
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {isPreview ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          {/* Title */}
          <div className="p-6 border-b border-gray-200 space-y-4">
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-xl font-semibold border-none outline-none resize-none placeholder-gray-400"
              placeholder="Note title..."
            />

            {/* Tags */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <div className="flex items-center space-x-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-indigo-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <form onSubmit={handleAddTag} className="inline">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className="w-20 text-xs border border-gray-300 rounded px-2 py-1"
                      placeholder="Add tag..."
                    />
                  </form>
                </div>
              </div>

              {/* Bookmark */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isBookmarked: !formData.isBookmarked })}
                className={`p-2 rounded-lg transition-colors ${
                  formData.isBookmarked
                    ? 'text-yellow-500 bg-yellow-50'
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                <Star className={`h-4 w-4 ${formData.isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {isPreview ? (
              <div className="h-full overflow-y-auto p-6">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {formData.content || 'Start writing your note...'}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full h-full p-6 border-none outline-none resize-none font-mono text-sm leading-relaxed"
                placeholder="Start writing your note in Markdown..."
              />
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {isPreview ? 'Preview Mode' : 'Markdown supported'}
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>{note ? 'Update Note' : 'Create Note'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
