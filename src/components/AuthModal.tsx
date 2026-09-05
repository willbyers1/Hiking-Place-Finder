import React, { useState } from 'react';
import { X, User, Mail, Lock, Sparkles, Shield, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
  onLogin: (email: string, pass: string) => { user: any; error?: string };
  onRegister: (name: string, email: string, pass: string) => { user: any; error?: string };
  onDemoLogin: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSwitchMode,
  onLogin,
  onRegister,
  onDemoLogin
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'login') {
      const res = onLogin(email, password);
      if (res.error) setErrorMessage(res.error);
    } else {
      const res = onRegister(name, email, password);
      if (res.error) setErrorMessage(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#040D05] rounded-3xl max-w-md w-full border border-white/10 shadow-2xl overflow-hidden flex flex-col text-stone-100">
        
        {/* Header */}
        <div className="bg-black/40 text-white p-6 relative border-b border-white/5">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
              Hiking Explorer Account
            </span>
          </div>

          <h2 className="text-xl font-serif font-bold text-stone-100">
            {mode === 'login' ? 'Welcome Back, Hiker' : 'Create Hiker Account'}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            {mode === 'login'
              ? 'Sign in to access your saved trails and progress logs.'
              : 'Start logging outdoor adventures and tracking your personal progress.'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Quick Demo Login Option */}
          <button
            onClick={onDemoLogin}
            type="button"
            className="w-full p-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-xs font-bold text-emerald-300 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Instant Demo Account (Alex Rivera)</span>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-3 text-[10px] text-stone-500 font-bold uppercase tracking-widest">
              Or with credentials
            </span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-semibold text-rose-300">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-stone-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-stone-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-stone-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-900 font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all mt-2"
            >
              {mode === 'login' ? 'Sign In to Account' : 'Register Account'}
            </button>
          </form>

          {/* Toggle Mode Footer */}
          <div className="text-center pt-2">
            {mode === 'login' ? (
              <p className="text-xs text-stone-400">
                Don't have an account?{' '}
                <button
                  onClick={() => onSwitchMode('register')}
                  className="font-bold text-emerald-400 hover:underline"
                >
                  Create one here
                </button>
              </p>
            ) : (
              <p className="text-xs text-stone-400">
                Already registered?{' '}
                <button
                  onClick={() => onSwitchMode('login')}
                  className="font-bold text-emerald-400 hover:underline"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
