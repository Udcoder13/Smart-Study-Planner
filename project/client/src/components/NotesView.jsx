import React, { useState } from 'react';
import { useStudy } from '../contexts/StudyContext';
import { Search, Star, Calendar, Edit3, Trash2, Filter, BookOpen } from 'lucide-react';
import NoteEditor from './NoteEditor';

export default function NotesView() {
  const { state, dispatch } = useStudy();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBookmarked, setFilterBookmarked] = useState(false);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const filteredNotes = state.notes
    .filter(note => {
      const matchesSearch = searchQuery === '' || 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = filterCategory === 'all' || note.category._id === filterCategory;
      const matchesBookmark = !filterBookmarked || note.isBookmarked;
      
      return matchesSearch && matchesCategory && matchesBookmark;
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowNoteEditor(true);
  };

  const { deleteNote, toggleBookmark } = useStudy();
  
  const handleDeleteNote = (noteId) => {
  if (window.confirm('Are you sure you want to delete this note?')) {
    deleteNote(noteId);
  }
  };

  const handleToggleBookmark = (noteId) => {
  toggleBookmark(noteId);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Notes</h1>
          <p className="text-gray-600">{filteredNotes.length} of {state.notes.length} notes</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search notes, tags, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Filter Options */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {state.categories.map(category => (
                 <option key={category._id} value={category._id}>
                 {category.name}
                </option>
            ))}
          </select>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterBookmarked}
              onChange={(e) => setFilterBookmarked(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Bookmarked only</span>
          </label>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {state.notes.length === 0 ? 'No notes yet' : 'No notes match your filters'}
            </h3>
            <p className="text-gray-600">
              {state.notes.length === 0 
                ? 'Start creating notes in your study categories'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group overflow-hidden"
            >
              {/* Category Header */}
              <div className={`h-2 bg-gradient-to-r ${note.category.color}`}></div>
              
              <div className="p-6">
                {/* Note Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {note.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{note.category.name}</span>
                      <span>•</span>
                      <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {note.isBookmarked && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                  )}
                </div>

                {/* Content Preview */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {note.content.slice(0, 200)}...
                </p>

                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{note.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleToggleBookmark(note.id)}
                      className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${
                        note.isBookmarked ? 'text-yellow-500' : 'text-gray-400'
                      }`}
                    >
                      <Star className={`h-3.5 w-3.5 ${note.isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleEditNote(note)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note Editor Modal */}
      {showNoteEditor && editingNote && (
        <NoteEditor
          note={editingNote}
          category={editingNote.category}
          onClose={() => {
            setShowNoteEditor(false);
            setEditingNote(null);
          }}
        />
      )}
    </div>
  );
}