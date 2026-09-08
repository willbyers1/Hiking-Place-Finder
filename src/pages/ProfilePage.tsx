import React from 'react';
import { User as UserIcon, Shield, Bookmark, TrendingUp, Download, Upload, LogOut } from 'lucide-react';
import { User, CompletedHike } from '../types';

interface ProfilePageProps {
  user: User | null;
  savedCount: number;
  completedHikes: CompletedHike[];
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  savedCount,
  completedHikes,
  onOpenAuth,
  onLogout
}) => {
  if (!user) {
    return (
      <div className="bg-[#040D05]/80 rounded-3xl border border-white/10 p-12 text-center space-y-4 max-w-lg mx-auto my-12 shadow-2xl backdrop-blur-md">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-serif font-bold text-stone-100">Account Sign In Required</h2>
        <p className="text-xs text-stone-400 leading-relaxed">
          Sign in or create an account to view your profile settings, sync saved trails, and export your personal hiking data logs.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-900 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const totalDistance = Math.round(completedHikes.reduce((sum, h) => sum + h.distanceKm, 0) * 10) / 10;
  const totalElevation = completedHikes.reduce((sum, h) => sum + h.elevationGainM, 0);

  const handleExportData = () => {
    const backupObj = {
      user,
      savedCount,
      completedHikes,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hiking_explorer_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-fade-in">
      {/* Profile Card */}
      <div className="bg-[#040D05]/80 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-emerald-500/30 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl font-serif font-bold text-stone-100">{user.name}</h1>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Verified Hiker
              </span>
            </div>
            <p className="text-xs text-stone-400 font-medium">{user.email}</p>
            <span className="text-[10px] text-stone-500 block pt-1">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-rose-500/30"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#040D05]/80 p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md text-center">
          <span className="text-[10px] font-bold uppercase text-stone-500 block tracking-widest">Saved Trails</span>
          <span className="text-xl font-extrabold text-stone-100 mt-1 block">{savedCount}</span>
        </div>

        <div className="bg-[#040D05]/80 p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md text-center">
          <span className="text-[10px] font-bold uppercase text-stone-500 block tracking-widest">Completed Logs</span>
          <span className="text-xl font-extrabold text-stone-100 mt-1 block">{completedHikes.length}</span>
        </div>

        <div className="bg-[#040D05]/80 p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md text-center">
          <span className="text-[10px] font-bold uppercase text-stone-500 block tracking-widest">Total Distance</span>
          <span className="text-xl font-extrabold text-stone-100 mt-1 block">{totalDistance} km</span>
        </div>

        <div className="bg-[#040D05]/80 p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md text-center">
          <span className="text-[10px] font-bold uppercase text-stone-500 block tracking-widest">Elevation Gain</span>
          <span className="text-xl font-extrabold text-emerald-400 mt-1 block">+{totalElevation} m</span>
        </div>
      </div>

      {/* Data Export / Backup Utility */}
      <div className="bg-[#040D05]/80 rounded-3xl border border-white/10 p-6 shadow-2xl backdrop-blur-md space-y-4 text-stone-100">
        <h2 className="text-base font-serif font-bold text-stone-100">Data Management & Offline Export</h2>
        <p className="text-xs text-stone-400 leading-relaxed">
          Your saved trails and completed hike history are securely persisted in your local account storage. You can download a JSON backup file anytime.
        </p>

        <div className="pt-2">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-900 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
          >
            <Download className="w-4 h-4" />
            Download Data Backup (JSON)
          </button>
        </div>
      </div>
    </div>
  );
};
