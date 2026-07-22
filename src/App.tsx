import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { ForgotPassword } from './components/ForgotPassword';
import { Dashboard } from './components/Dashboard';
import { ToastContainer } from './components/Toast';
import { AuthView, User, ToastMessage } from './types/auth';
import {
  getCurrentUser,
  setCurrentUserSession,
  clearCurrentUserSession,
  initializeDemoData,
} from './utils/authStorage';

export default function App() {
  const [currentView, setCurrentView] = useState<AuthView>('signin');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [demoAutofillTrigger, setDemoAutofillTrigger] = useState(0);

  // Initialize demo accounts and restore existing session
  useEffect(() => {
    initializeDemoData();
    const activeUser = getCurrentUser();
    if (activeUser) {
      setCurrentUser(activeUser);
      setCurrentView('dashboard');
    }
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLoginSuccess = (user: User, rememberMe: boolean) => {
    setCurrentUser(user);
    setCurrentUserSession(user, rememberMe);
    setCurrentView('dashboard');
  };

  const handleRegisterSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentUserSession(user, true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    clearCurrentUserSession();
    setCurrentUser(null);
    setCurrentView('signin');
    addToast('Signed out of session', 'info');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const handleTriggerDemoFill = () => {
    setCurrentView('signin');
    setDemoAutofillTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Notification Toast System */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onSelectView={(view) => setCurrentView(view)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onFillDemoCredentials={handleTriggerDemoFill}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl py-6">
          {currentView === 'signin' && (
            <SignIn
              onSuccessLogin={handleLoginSuccess}
              onNavigate={(view) => setCurrentView(view)}
              onShowToast={addToast}
              demoAutofillTrigger={demoAutofillTrigger}
            />
          )}

          {currentView === 'signup' && (
            <SignUp
              onSuccessRegister={handleRegisterSuccess}
              onNavigate={(view) => setCurrentView(view)}
              onShowToast={addToast}
            />
          )}

          {currentView === 'forgot-password' && (
            <ForgotPassword
              onNavigate={(view) => setCurrentView(view)}
              onShowToast={addToast}
            />
          )}

          {currentView === 'dashboard' && currentUser && (
            <Dashboard
              user={currentUser}
              onLogout={handleLogout}
              onUpdateUser={handleUpdateUser}
              onShowToast={addToast}
            />
          )}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
        <p>NexusOS — Sleek Authentication & Session Management Portal</p>
      </footer>
    </div>
  );
}
