import { User } from '../types';

const AUTH_USER_KEY = 'hiking_explorer_current_user';
const USERS_LIST_KEY = 'hiking_explorer_registered_users';

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to parse current user', e);
    return null;
  }
}

export function registerUser(name: string, email: string, password: string): { user: User; error?: string } {
  if (!name.trim() || !email.trim() || !password.trim()) {
    return { user: null as any, error: 'Please fill in all required fields.' };
  }
  if (password.length < 6) {
    return { user: null as any, error: 'Password must be at least 6 characters long.' };
  }

  const existingUsersRaw = localStorage.getItem(USERS_LIST_KEY);
  const users: { user: User; passwordHash: string }[] = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

  if (users.some((u) => u.user.email.toLowerCase() === email.toLowerCase().trim())) {
    return { user: null as any, error: 'An account with this email already exists.' };
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
    createdAt: new Date().toISOString()
  };

  users.push({ user: newUser, passwordHash: password });
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));

  return { user: newUser };
}

export function loginUser(email: string, password: string): { user: User; error?: string } {
  const existingUsersRaw = localStorage.getItem(USERS_LIST_KEY);
  const users: { user: User; passwordHash: string }[] = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

  const found = users.find((u) => u.user.email.toLowerCase() === email.toLowerCase().trim());
  if (!found) {
    return { user: null as any, error: 'Invalid email or password.' };
  }

  if (found.passwordHash !== password) {
    return { user: null as any, error: 'Invalid email or password.' };
  }

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(found.user));
  return { user: found.user };
}

export function loginAsDemoUser(): User {
  const demoUser: User = {
    id: 'demo-hiker-101',
    name: 'Alex Rivera',
    email: 'alex.hiker@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(demoUser));
  return demoUser;
}

export function logoutUser(): void {
  localStorage.removeItem(AUTH_USER_KEY);
}
