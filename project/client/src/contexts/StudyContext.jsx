import React, { createContext, useContext, useReducer } from 'react';
import api from '../api'; // Your axios instance

const initialState = {
  categories: [],
  notes: [],
  activities: [],
  suggestions: [],
  selectedCategory: null,
  selectedNote: null,
  searchQuery: '',
  viewMode: 'dashboard'
};

function studyReducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_SELECTED_NOTE':
      return { ...state, selectedNote: action.payload };
    case 'LOAD_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c => c._id === action.payload._id ? action.payload : c)
      };
    case 'REMOVE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c._id !== action.payload),
        notes: state.notes.filter(note => note.category._id !== action.payload)
      };
    case 'LOAD_NOTES':
      return { ...state, notes: action.payload };
    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.payload] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(n => n._id === action.payload._id ? action.payload : n)
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(n => n._id !== action.payload)
      };
    case 'TOGGLE_BOOKMARK':
      return {
        ...state,
        notes: state.notes.map(n =>
          n._id === action.payload ? { ...n, isBookmarked: !n.isBookmarked } : n
        )
      };
    case 'LOG_ACTIVITY':
      return {
        ...state,
        activities: [{ ...action.payload, id: Date.now() }, ...state.activities.slice(0, 20)]
      };
    case 'GENERATE_AI_SUGGESTIONS':
      return { ...state };
    default:
      return state;
  }
}

const StudyContext = createContext();

export function StudyProvider({ children }) {
  const [state, dispatch] = useReducer(studyReducer, initialState);

  // CATEGORY METHODS
  async function addCategory(categoryData) {
    try {
      console.log('[FRONTEND] Creating category:', categoryData);
      const { data } = await api.post('/categories', categoryData);
      console.log('[FRONTEND] Category created:', data);
      dispatch({ type: 'ADD_CATEGORY', payload: data }); 

      dispatch({
        type: 'LOG_ACTIVITY',
        payload: {
          type: 'category_created',
          title: `Created category "${data.name}"`,
          categoryId: data._id,
          timestamp: new Date().toISOString()
        }
      });
      return data;
    } catch (err) {
      console.error('[FRONTEND] Failed to create category', err);
      if (err.response) {
        console.error('[FRONTEND] API error response:', err.response.data);
      }
      // Rethrow so callers can handle errors (modal will show message)
      throw err;
    }
  }

  async function updateCategory(id, updates) {
    try {
      const { data } = await api.put(`/categories/${id}`, updates);
      dispatch({ type: 'UPDATE_CATEGORY', payload: data });
    } catch (err) {
      console.error('Failed to update category', err);
    }
  }

  async function deleteCategory(id) {
    try { 
      await api.delete(`/categories/${id}`);
      dispatch({ type: 'REMOVE_CATEGORY', payload: id });
    } catch (err) {
      console.error('Failed to delete category', err);
    }
  }

  async function loadCategoriesForUser() {
    try {
      const { data } = await api.get('/categories');
      dispatch({ type: 'LOAD_CATEGORIES', payload: data });
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  }

  // NOTE METHODS
  async function addNote(noteData) {
    try {
      const { data } = await api.post('/notes', noteData);
      dispatch({ type: 'ADD_NOTE', payload: data }); // ✅ FIXED

      dispatch({
        type: 'LOG_ACTIVITY',
        payload: {
          type: 'note_created',
          title: `Created note "${data.title}"`,
          categoryId: data.category._id,
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error('Failed to create note', err);
    }
  }

  async function updateNote(id, updates) {
    try {
      const { data } = await api.put(`/notes/${id}`, updates);
      dispatch({ type: 'UPDATE_NOTE', payload: data });

      dispatch({
        type: 'LOG_ACTIVITY',
        payload: {
          type: 'note_updated',
          title: `Updated note "${data.title}"`,
          categoryId: data.category._id,
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error('Failed to update note', err);
    }
  }

  async function deleteNote(id) {
    try {
      await api.delete(`/notes/${id}`);
      dispatch({ type: 'DELETE_NOTE', payload: id });
    } catch (err) {
      console.error('Failed to delete note', err);
    }
  }

  async function loadNotes() {
    try {
      const { data } = await api.get('/notes');
      dispatch({ type: 'LOAD_NOTES', payload: data });
    } catch (err) {
      console.error('Failed to load notes', err);
    }
  }

  return (
    <StudyContext.Provider
      value={{
        state,
        dispatch,
        addCategory,
        updateCategory,
        deleteCategory,
        loadCategoriesForUser,
        addNote,
        updateNote,
        deleteNote,
        loadNotes
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error("useStudy must be used within StudyProvider");
  return ctx;
}
