import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, Check, X, Shield, ArrowRight, Github, Chrome, Apple } from 'lucide-react';
import { AuthView } from '../types/auth';
import {
  validateEmail,
  checkEmailExists,
  registerUser,
  evaluatePasswordRequirements,
  evaluatePasswordStrength,
} from '../utils/authStorage';

interface SignUpProps {
  onSuccessRegister: (user: any) => void;
  onNavigate: (view: AuthView) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const SignUp: React.FC<SignUpProps> = ({
  onSuccessRegister,
  onNavigate,
  onShowToast,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    general?: string;
  }>({});

  const passwordReqs = evaluatePasswordRequirements(password);
  const passwordStrength = evaluatePasswordStrength(password);

  const handleValidation = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Please enter your full name';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (checkEmailExists(email)) {
      newErrors.email = 'An account with this email already exists';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (passwordStrength.score < 2) {
      newErrors.password = 'Password is too weak. Please meet more requirements.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must accept the Terms of Service to create an account';
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
      const result = registerUser(name, email, password);

      if (result.success && result.user) {
        onShowToast('Account created successfully! Welcome to AuraAuth.', 'success');
        onSuccessRegister(result.user);
      } else {
        setErrors({ general: result.error || 'Failed to create account' });
        onShowToast(result.error || 'Registration failed', 'error');
      }
      setIsLoading(false);
    }, 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-stretch justify-center gap-8"
    >
      {/* Sign Up Main Form Card */}
      <div className="w-full lg:max-w-[460px] bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Get started with your developer account today.
            </p>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Jenkins"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Email Address */}
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
                  placeholder="sarah@example.com"
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

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  className={`w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800/60 border rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.password}</p>
              )}

              {/* Password Strength Progress Bar */}
              {password && (
                <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                    <span className="text-slate-500 dark:text-slate-400">Password strength:</span>
                    <span className={`font-semibold ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.score <= 1
                          ? 'bg-rose-500'
                          : passwordStrength.score === 2
                          ? 'bg-amber-500'
                          : passwordStrength.score === 3
                          ? 'bg-blue-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${passwordStrength.percentage}%` }}
                    />
                  </div>

                  {/* Password Requirements */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2.5 text-[11px]">
                    <div className={`flex items-center gap-1.5 ${passwordReqs.minLength ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                      {passwordReqs.minLength ? <Check className="w-3 h-3 stroke-3" /> : <X className="w-3 h-3" />}
                      <span>8+ characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordReqs.hasUpper ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                      {passwordReqs.hasUpper ? <Check className="w-3 h-3 stroke-3" /> : <X className="w-3 h-3" />}
                      <span>Uppercase letter</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordReqs.hasLower ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                      {passwordReqs.hasLower ? <Check className="w-3 h-3 stroke-3" /> : <X className="w-3 h-3" />}
                      <span>Lowercase letter</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordReqs.hasNumber ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                      {passwordReqs.hasNumber ? <Check className="w-3 h-3 stroke-3" /> : <X className="w-3 h-3" />}
                      <span>Number (0-9)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400 leading-tight">
                  I agree to the{' '}
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                    Privacy Policy
                  </a>.
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.terms}</p>
              )}
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
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Switch to Sign In */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('signin')}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign in instead
          </button>
        </p>
      </div>

      {/* Feature Side / Preview Side */}
      <div className="hidden lg:flex flex-col w-[420px] justify-between">
        <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-500/20 flex-1 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold leading-snug mb-3">
              Start building with NexusOS
            </h2>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              Create your account to unlock high-performance infrastructure, instant session synchronization, and zero-latency auth token flows.
            </p>
            <ul className="space-y-3.5 text-xs font-semibold">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <span>Unlimited project workspaces</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <span>Priority 24/7 technical support</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <span>Advanced security and session analytics</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 relative z-10 pt-6 border-t border-white/20">
            <button
              onClick={() => onNavigate('signin')}
              className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-lg shadow-blue-900/20 text-sm"
            >
              Sign In to Existing Account
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-10 -left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        <div className="mt-4 px-2">
          <p className="text-slate-500 dark:text-slate-400 text-xs italic">
            "NexusOS has completely simplified our team registration and login workflow. The interface is clean, sleek, and fast."
          </p>
          <p className="mt-1 font-bold text-xs text-slate-700 dark:text-slate-300">
            — Marcus Vance, Engineering Lead
          </p>
        </div>
      </div>
    </motion.div>
  );
};
