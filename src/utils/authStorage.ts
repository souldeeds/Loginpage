import { User, PasswordRequirements, PasswordStrength } from '../types/auth';

const USERS_STORAGE_KEY = 'auth_portal_users';
const CURRENT_USER_KEY = 'auth_portal_current_user';
const REMEMBER_ME_KEY = 'auth_portal_remember_me';

// Seed default demo user if empty
export const initializeDemoData = (): void => {
  const existingUsers = localStorage.getItem(USERS_STORAGE_KEY);
  if (!existingUsers) {
    const demoUser: User = {
      id: 'usr_demo_101',
      name: 'Alex Rivera',
      email: 'alex@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastLoginAt: new Date().toISOString(),
      provider: 'email',
    };
    
    // Password stored in memory map for demo: alex@example.com -> Password123!
    const usersMap: Record<string, { user: User; passwordHash: string }> = {
      'alex@example.com': {
        user: demoUser,
        passwordHash: 'Password123!', // In real app, this would be salted & hashed
      },
    };
    
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersMap));
  }
};

export const getStoredUsers = (): Record<string, { user: User; passwordHash: string }> => {
  try {
    initializeDemoData();
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Error reading users from storage', e);
    return {};
  }
};

export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    if (!userStr) {
      // Check session storage if remember me was false
      const sessionUserStr = sessionStorage.getItem(CURRENT_USER_KEY);
      return sessionUserStr ? JSON.parse(sessionUserStr) : null;
    }
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Error reading current user', e);
    return null;
  }
};

export const setCurrentUserSession = (user: User, rememberMe: boolean): void => {
  const userJson = JSON.stringify(user);
  if (rememberMe) {
    localStorage.setItem(CURRENT_USER_KEY, userJson);
    localStorage.setItem(REMEMBER_ME_KEY, 'true');
    sessionStorage.removeItem(CURRENT_USER_KEY);
  } else {
    sessionStorage.setItem(CURRENT_USER_KEY, userJson);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
  }
};

export const clearCurrentUserSession = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(REMEMBER_ME_KEY);
  sessionStorage.removeItem(CURRENT_USER_KEY);
};

export const checkEmailExists = (email: string): boolean => {
  const users = getStoredUsers();
  return Boolean(users[email.toLowerCase().trim()]);
};

export const registerUser = (
  name: string,
  email: string,
  passwordHash: string,
  provider: 'email' | 'google' | 'github' | 'apple' = 'email'
): { success: boolean; user?: User; error?: string } => {
  const cleanedEmail = email.toLowerCase().trim();
  const users = getStoredUsers();

  if (users[cleanedEmail]) {
    return { success: false, error: 'An account with this email address already exists.' };
  }

  const newUser: User = {
    id: `usr_${Math.random().toString(36).substring(2, 11)}`,
    name: name.trim(),
    email: cleanedEmail,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    provider,
  };

  users[cleanedEmail] = {
    user: newUser,
    passwordHash,
  };

  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return { success: true, user: newUser };
  } catch (e) {
    return { success: false, error: 'Failed to save account. Storage error.' };
  }
};

export const authenticateUser = (
  email: string,
  passwordHash: string
): { success: boolean; user?: User; error?: string } => {
  const cleanedEmail = email.toLowerCase().trim();
  const users = getStoredUsers();
  const record = users[cleanedEmail];

  if (!record) {
    return { success: false, error: 'No account found with this email address.' };
  }

  if (record.passwordHash !== passwordHash) {
    return { success: false, error: 'Incorrect password. Please check your credentials.' };
  }

  // Update last login
  record.user.lastLoginAt = new Date().toISOString();
  users[cleanedEmail] = record;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    // Ignore error
  }

  return { success: true, user: record.user };
};

export const updateUserProfile = (
  email: string,
  updates: { name?: string; avatarUrl?: string }
): User | null => {
  const cleanedEmail = email.toLowerCase().trim();
  const users = getStoredUsers();
  const record = users[cleanedEmail];

  if (!record) return null;

  if (updates.name) record.user.name = updates.name.trim();
  if (updates.avatarUrl) record.user.avatarUrl = updates.avatarUrl;

  users[cleanedEmail] = record;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  return record.user;
};

// Password requirements check
export const evaluatePasswordRequirements = (password: string): PasswordRequirements => {
  return {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };
};

export const evaluatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return { score: 0, label: 'Weak', color: 'bg-zinc-200 text-zinc-500', percentage: 0 };
  }

  const reqs = evaluatePasswordRequirements(password);
  const metCount = Object.values(reqs).filter(Boolean).length;

  if (password.length < 6) {
    return { score: 1, label: 'Weak', color: 'bg-red-500 text-red-600', percentage: 20 };
  }

  if (metCount <= 2) {
    return { score: 1, label: 'Weak', color: 'bg-red-500 text-red-600', percentage: 35 };
  } else if (metCount === 3) {
    return { score: 2, label: 'Fair', color: 'bg-amber-500 text-amber-600', percentage: 55 };
  } else if (metCount === 4) {
    return { score: 3, label: 'Good', color: 'bg-blue-500 text-blue-600', percentage: 80 };
  } else {
    return { score: 4, label: 'Strong', color: 'bg-emerald-500 text-emerald-600', percentage: 100 };
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};
