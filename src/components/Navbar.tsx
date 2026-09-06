import React, { useState } from 'react';
import { Mountain, Bookmark, TrendingUp, Compass, User as UserIcon, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: 'explore' | 'saved' | 'progress' | 'profile';
  setActiveTab: (tab: 'explore' | 'saved' | 'progress' | 'profile') => void;
  savedCount: number;
  completedCount: number;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  completedCount,
  user,
  onOpenAuth,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#040D05]/90 backdrop-blur-md border-b border-white/5 text-stone-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <button
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
              <Mountain className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-serif italic font-bold text-xl tracking-tight text-emerald-400 block leading-tight">
                Trail<span className="text-stone-100 font-sans not-italic font-bold">Explorer</span>
              </span>
              <span className="text-[9px] text-stone-400 uppercase tracking-widest font-semibold block">
                Outdoor Fitness Platform
              </span>
            </div>
          </button>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'explore'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-white/5'
              }`}
            >
              <Compass className="w-4 h-4" />
              Discovery
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all relative ${
                activeTab === 'saved'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-white/5'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Saved Trails
              {savedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-extrabold bg-emerald-500 text-stone-950 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all relative ${
                activeTab === 'progress'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-white/5'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              My Progress
              {completedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-stone-800 text-emerald-400 border border-stone-700 rounded-full">
                  {completedCount}
                </span>
              )}
            </button>
          </nav>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full border transition-all ${
                    activeTab === 'profile'
                      ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                      : 'border-white/10 bg-white/5 hover:border-emerald-500/30 text-stone-200'
                  }`}
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/50"
                  />
                  <span className="text-xs font-semibold max-w-[100px] truncate">{user.name}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </button>
                <button
                  onClick={onLogout}
                  title="Log out"
                  className="p-2 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-900 font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-950/50 hover:scale-[1.02]"
              >
                <UserIcon className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-stone-300 hover:bg-white/5"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#040D05] border-b border-white/10 px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => {
              setActiveTab('explore');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
              activeTab === 'explore' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-stone-300'
            }`}
          >
            <Compass className="w-4 h-4" />
            Discovery
          </button>

          <button
            onClick={() => {
              setActiveTab('saved');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold ${
              activeTab === 'saved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-stone-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bookmark className="w-4 h-4" />
              Saved Trails
            </div>
            {savedCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500 text-stone-950 rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('progress');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold ${
              activeTab === 'progress' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-stone-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4" />
              My Progress & Stats
            </div>
            {completedCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-stone-800 text-emerald-400 border border-stone-700 rounded-full">
                {completedCount}
              </span>
            )}
          </button>

          <div className="pt-2 border-t border-white/5">
            {user ? (
              <div className="flex items-center justify-between px-2 py-2">
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 text-left"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-500"
                  />
                  <div>
                    <span className="block text-xs font-bold text-white">{user.name}</span>
                    <span className="block text-[10px] text-stone-400">{user.email}</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2 text-stone-400 hover:text-rose-400"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-500 text-stone-900 font-bold text-xs uppercase tracking-wider"
              >
                <UserIcon className="w-4 h-4" />
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
