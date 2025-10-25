import React, { useState } from 'react';
import { useStudy } from '../contexts/StudyContext';
import { ArrowLeft, Plus, Search, BookOpen, Star, Calendar, Edit3, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import NoteEditor from './NoteEditor';

export default function CategoryView() {
  const { state, dispatch, deleteCategory, addNote, updateNote, loadNotes, deleteNote } = useStudy();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const category = state.categories.find(cat => cat._id === state.selectedCategory);

  const categoryNotes = state.notes
    .filter(note => note.category._id === state.selectedCategory)
    .filter(note =>
      searchQuery === '' ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  if (!category) return null;

  const IconComponent = Icons[category.icon] || Icons.BookOpen;
  const completionPercentage = category.totalTopics > 0
    ? Math.round((categoryNotes.length / category.totalTopics) * 100)
    : 0;

  const handleCreateNote = () => {
    setEditingNote(null);
    setShowNoteEditor(true);
  };

  const handleDeleteCategory = async () => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(category._id);
        dispatch({ type: 'SET_VIEW_MODE', payload: 'dashboard' });
      } catch (err) {
        console.error('Failed to delete category', err);
      }
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowNoteEditor(true);
  };

  const handleDeleteNote = async (noteId) => {
  if (window.confirm('Are you sure you want to delete this note?')) {
    try {
      await deleteNote(noteId); // actually call backend
    } catch (err) {
      console.error('Failed to delete note', err);
    }
  }
};

  const handleToggleBookmark = (noteId) => {
    dispatch({ type: 'TOGGLE_BOOKMARK', payload: noteId });
  };

  const handleNoteSubmit = async (formData, isEdit = false, noteId = null) => {
    if (isEdit && noteId) {
      await updateNote(noteId, formData);
    } else {
      await addNote(formData);
    }
    await loadNotes();
    setShowNoteEditor(false);
    setEditingNote(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'dashboard' })}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>

          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${category.color}`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-gray-600">{category.description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCreateNote}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Note</span>
          </button>
          <button
            onClick={handleDeleteCategory}
            className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
          >
            <Trash2 className="h-5 w-5" />
            <span className="sr-only">Delete Category</span>
          </button>
        </div>
      </div>

      {/* Progress + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Notes</p>
              <p className="text-3xl font-bold text-gray-900">{categoryNotes.length}</p>
            </div>
            <BookOpen className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Progress</p>
              <p className="text-3xl font-bold text-gray-900">{completionPercentage}%</p>
            </div>
            <div className="w-12 h-12 relative">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2"
                  strokeDasharray={`${completionPercentage}, 100`}
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Bookmarked</p>
              <p className="text-3xl font-bold text-gray-900">
                {categoryNotes.filter(note => note.isBookmarked).length}
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Notes ({categoryNotes.length})
          </h2>
        </div>

        {categoryNotes.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'No notes match your search query'
                : 'Start by creating your first note in this category'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateNote}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Create First Note</span>
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {categoryNotes.map((note) => (
              <div
                key={note._id}
                className="p-6 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {note.title}
                      </h3>
                      {note.isBookmarked && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {note.content.slice(0, 150)}...
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                      </div>
                      {note.tags.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <span>Tags:</span>
                          <span>{note.tags.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleBookmark(note._id)}
                      className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
                        note.isBookmarked ? 'text-yellow-500' : 'text-gray-400'
                      }`}
                    >
                      <Star className={`h-4 w-4 ${note.isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleEditNote(note)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note Editor Modal */}
      {showNoteEditor && (
  <NoteEditor
    note={editingNote}
    category={category}
    onSubmit={(formData) =>
      handleNoteSubmit(
        formData,
        Boolean(editingNote),
        editingNote?._id
      )
    }
    onClose={() => {
      setShowNoteEditor(false);
      setEditingNote(null);
    }}
  />
)}

    </div>
  );
}
