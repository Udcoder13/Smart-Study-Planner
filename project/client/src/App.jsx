import React, { useState, useEffect } from 'react';
import { StudyProvider, useStudy } from './contexts/StudyContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CategoryView from './components/CategoryView';
import NotesView from './components/NotesView';
import AuthForm from './components/AuthForm';
import CreateCategoryModal from './components/CreateCategoryModal';

function AppContent() {
  const { state, dispatch, loadCategoriesForUser, loadNotes } = useStudy();
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showCreateModal, setShowCreateModal] = useState(false); // ✅ Global modal control

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'null') {
      setUser({ token });
      loadCategoriesForUser();
      loadNotes();
    }
  }, []);

  const handleAuthSuccess = async (userData) => {
    setUser(userData);
    setShowAuth(false);
    await loadCategoriesForUser();
    await loadNotes();
  };

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <AuthForm mode={authMode} onSuccess={handleAuthSuccess} />
        <button
          onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
          className="mt-4 text-sm text-indigo-600 hover:underline"
        >
          {authMode === 'login'
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </button>
        <button
          onClick={() => setShowAuth(false)}
          className="mt-2 text-xs text-gray-500 hover:underline"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Smart Study Manager</h1>
        <button
          onClick={() => {
            setAuthMode('login');
            setShowAuth(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Login / Register
        </button>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (state.viewMode) {
      case 'category':
        return <CategoryView />;
      case 'notes':
        return <NotesView />;
      default:
        return <Dashboard onCreateCategory={() => setShowCreateModal(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLogout={() => {
          localStorage.removeItem('token');
          setUser(null);
          dispatch({ type: 'LOAD_CATEGORIES', payload: [] });
          dispatch({ type: 'LOAD_NOTES', payload: [] });
        }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>

      {showCreateModal && (
        <CreateCategoryModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <StudyProvider>
  <AppContent />
    </StudyProvider>
  );
}
