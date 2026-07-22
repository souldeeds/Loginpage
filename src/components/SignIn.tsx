import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Github, Chrome, Apple, Sparkles } from 'lucide-react';
import { AuthView } from '../types/auth';
import { validateEmail, authenticateUser, registerUser } from '../utils/authStorage';

interface SignInProps {
  onSuccessLogin: (user: any, rememberMe: boolean) => void;
  onNavigate: (view: AuthView) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
  demoAutofillTrigger?: number;
}

export const SignIn: React.FC<SignInProps> = ({
  onSuccessLogin,
  onNavigate,
  onShowToast,
  demoAutofillTrigger,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Field validation errors
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  useEffect(() => {
    if (demoAutofillTrigger && demoAutofillTrigger > 0) {
      setEmail('alex@example.com');
      setPassword('Password123!');
      setErrors({});
    }
  }, [demoAutofillTrigger]);

  const handleValidation = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!handleValidation()) return;

    setIsLoading(true);

    setTimeout(() => {
      const result = authenticateUser(email, password);

      if (result.success && result.user) {
        onShowToast(`Welcome back, ${result.user.name.split(' ')[0]}!`, 'success');
        onSuccessLogin(result.user, rememberMe);
      } else {
        setErrors({ general: result.error || 'Invalid credentials' });
        onShowToast(result.error || 'Sign in failed', 'error');
      }
      setIsLoading(false);
    }, 600);
  };

  const handleSocialLogin = (provider: 'google' | 'github' | 'apple') => {
    setIsLoading(true);
    const providerNames = { google: 'Google', github: 'GitHub', apple: 'Apple' };
    
    setTimeout(() => {
      // Create or log in with social identity
      const demoEmail = `social_${provider}@auraauth.io`;
      const name = `${providerNames[provider]} User`;
      
      let res = authenticateUser(demoEmail, 'SocialAuthToken123!');
      if (!res.success) {
        const regRes = registerUser(name, demoEmail, 'SocialAuthToken123!', provider);
        if (regRes.user) {
          res = { success: true, user: regRes.user };
        }
      }

      if (res.user) {
        onShowToast(`Signed in with ${providerNames[provider]} successfully!`, 'success');
        onSuccessLogin(res.user, true);
      } else {
        onShowToast('Social login failed', 'error');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleAutofillDemo = () => {
    setEmail('alex@example.com');
    setPassword('Password123!');
    setErrors({});
    onShowToast('Demo credentials autofilled!', 'info');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-stretch justify-center gap-8"
    >
      {/* Sign In Main Form Card */}
      <div className="w-full lg:max-w-[460px] bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Please enter your details to sign in.
            </p>
          </div>

          {/* Demo Credentials Quick Switcher */}
          <div className="mb-6 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>
                Demo email: <strong className="font-semibold text-slate-900 dark:text-white">alex@example.com</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors shrink-0"
            >
              Auto-fill
            </button>
          </div>

          {/* General Error Alert */}
          {errors.general && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
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
                    errors.email
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800/60 border rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
              />
              <label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-400 font-medium cursor-pointer">
                Keep me signed in
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              or continue with
            </span>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow" />
          </div>

          {/* Social Buttons */}
          <div className="mt-6 grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-700/80 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <Chrome className="w-4 h-4 text-red-500" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('github')}
              className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-700/80 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <Github className="w-4 h-4 text-slate-800 dark:text-white" />
              <span>GitHub</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('apple')}
              className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-700/80 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <Apple className="w-4 h-4 text-slate-900 dark:text-white" />
              <span>Apple</span>
            </button>
          </div>
        </div>

        {/* Footer switch */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          Don't have an account yet?{' '}
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Create an account
          </button>
        </p>
      </div>

      {/* Feature / Banner Preview Side (Sleek Theme) */}
      <div className="hidden lg:flex flex-col w-[420px] justify-between">
        <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-500/20 flex-1 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold leading-snug mb-3">
              Secure infrastructure for your apps
            </h2>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              Join 10,000+ developers building with enterprise authentication, real-time sessions, and zero friction.
            </p>
            <ul className="space-y-3.5 text-xs font-semibold">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <span>Unlimited user project workspaces</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <span>Encrypted session management & token persistence</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <span>OAuth provider auto-linking & recovery</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 relative z-10 pt-6 border-t border-white/20">
            <button
              onClick={() => onNavigate('signup')}
              className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-lg shadow-blue-900/20 text-sm"
            >
              Start Free Registration
            </button>
          </div>

          {/* Decorative glows */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-10 -left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />
        </div>

        <div className="mt-4 px-2">
          <p className="text-slate-500 dark:text-slate-400 text-xs italic">
            "NexusOS authentication is incredibly smooth and reliable. Password validation and session handling work right out of the box."
          </p>
          <p className="mt-1 font-bold text-xs text-slate-700 dark:text-slate-300">
            — Sarah Chen, Lead Architect
          </p>
        </div>
      </div>
    </motion.div>
  );
};
