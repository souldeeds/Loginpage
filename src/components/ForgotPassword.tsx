import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, CheckCircle2, KeyRound, Shield } from 'lucide-react';
import { AuthView } from '../types/auth';
import { validateEmail } from '../utils/authStorage';

interface ForgotPasswordProps {
  onNavigate: (view: AuthView) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      onShowToast('Password reset instructions sent!', 'success');
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/60 dark:shadow-none border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        {/* Top Half Media Banner with Full Logo Image */}
        <div className="w-full h-44 sm:h-48 bg-slate-950 relative flex items-center justify-center p-6 border-b border-slate-200/80 dark:border-slate-800">
          <img
            src="https://res.cloudinary.com/pukpucds/image/upload/v1784719760/Weversity_Logo_with_less_padding_kbwek2.png"
            alt="Logo Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain filter drop-shadow-md"
          />
        </div>

        <div className="p-6 sm:p-8">
          {isSubmitted ? (
            <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Check your inbox
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                We've sent password reset instructions to <strong className="text-slate-800 dark:text-slate-200">{email}</strong> if an account exists.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onNavigate('signin')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all"
              >
                Return to Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  onShowToast('Reset link resent to email.', 'info');
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold py-1"
              >
                Didn't receive email? Try again
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Reset your password
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      error
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                  />
                </div>
                {error && (
                  <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => onNavigate('signin')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    </motion.div>
  );
};
