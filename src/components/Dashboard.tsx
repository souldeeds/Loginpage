import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Shield, Clock, Calendar, Mail, CheckCircle2, LogOut, Edit3, Save, Key, Sparkles, RefreshCw } from 'lucide-react';
import { User } from '../types/auth';
import { updateUserProfile } from '../utils/authStorage';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (updatedUser: User) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onLogout,
  onUpdateUser,
  onShowToast,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user.name);

  const presetAvatars = [
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
  ];

  const handleSaveName = () => {
    if (!editedName.trim()) {
      onShowToast('Name cannot be empty', 'error');
      return;
    }

    const updated = updateUserProfile(user.email, { name: editedName });
    if (updated) {
      onUpdateUser(updated);
      setIsEditingName(false);
      onShowToast('Profile name updated successfully!', 'success');
    }
  };

  const handleSelectAvatar = (url: string) => {
    const updated = updateUserProfile(user.email, { avatarUrl: url });
    if (updated) {
      onUpdateUser(updated);
      onShowToast('Avatar updated!', 'success');
    }
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      {/* Welcome Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={user.avatarUrl || presetAvatars[0]}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500/30 shadow-md bg-slate-100 dark:bg-slate-800"
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-600 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="px-3 py-1 text-lg font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {user.name}
                    </h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title="Edit Name"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.email}</span>
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  <Shield className="w-3 h-3 text-blue-600" />
                  Authenticated
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 capitalize">
                  Provider: {user.provider || 'Email'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full sm:w-auto px-4 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-semibold text-xs rounded-xl border border-rose-200/80 dark:border-rose-800 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>

        {/* Change Avatar Selector */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Choose Avatar Preset
          </label>
          <div className="flex items-center gap-3">
            {presetAvatars.map((url, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAvatar(url)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                  user.avatarUrl === url
                    ? 'border-blue-600 scale-105 shadow-md shadow-blue-500/20'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={url} alt={`Avatar ${idx}`} className="w-9 h-9 rounded-lg object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-xl">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Security Status
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                Protected Session
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Member Since
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {formatDate(user.createdAt).split(',')[0]}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Last Active
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {formatDate(user.lastLoginAt).split(',')[0]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Info Details Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Account Metadata & Details</span>
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          <div className="py-3 flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-medium">User Identifier ID</span>
            <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-800 dark:text-slate-200 font-mono text-[11px]">
              {user.id}
            </code>
          </div>

          <div className="py-3 flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Full Registered Name</span>
            <span className="font-semibold text-slate-900 dark:text-white">{user.name}</span>
          </div>

          <div className="py-3 flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Email Address</span>
            <span className="font-semibold text-slate-900 dark:text-white">{user.email}</span>
          </div>

          <div className="py-3 flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Local Storage Status</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
