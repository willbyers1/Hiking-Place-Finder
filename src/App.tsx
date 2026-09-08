import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { ExplorePage } from './pages/ExplorePage';
import { TrailDetailsPage } from './pages/TrailDetailsPage';
import { SavedTrailsPage } from './pages/SavedTrailsPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProfilePage } from './pages/ProfilePage';
import { useAuth } from './hooks/useAuth';
import { useLocation } from './hooks/useLocation';
import {
  getSavedTrailIds,
  saveTrail,
  removeSavedTrail,
  getCompletedHikes,
  addCompletedHike,
  deleteCompletedHike
} from './services/storageService';
import { CompletedHike } from './types';
import { CheckCircle2, Bookmark, Sparkles } from 'lucide-react';

export default function App() {
  const {
    user,
    isAuthenticated,
    isAuthModalOpen,
    authMode,
    openLoginModal,
    openRegisterModal,
    closeAuthModal,
    setAuthMode,
    login,
    register,
    loginDemo,
    logout
  } = useAuth();

  const { location, isLoading: isLocating, requestLocation } = useLocation();

  const [activeTab, setActiveTab] = useState<'explore' | 'saved' | 'progress' | 'profile'>('explore');
  const [selectedTrailId, setSelectedTrailId] = useState<string | null>(null);

  const [savedTrailIds, setSavedTrailIds] = useState<string[]>([]);
  const [completedHikes, setCompletedHikes] = useState<CompletedHike[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync stored data when user changes
  useEffect(() => {
    const userId = user?.id || 'guest';
    setSavedTrailIds(getSavedTrailIds(userId));
    setCompletedHikes(getCompletedHikes(userId));
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleToggleSave = (e: React.MouseEvent, trailId: string) => {
    e.stopPropagation();
    const userId = user?.id || 'guest';

    if (savedTrailIds.includes(trailId)) {
      const updated = removeSavedTrail(userId, trailId);
      setSavedTrailIds(updated);
      showToast('Trail removed from saved list');
    } else {
      const updated = saveTrail(userId, trailId);
      setSavedTrailIds(updated);
      showToast('Trail saved to your library!');
    }
  };

  const handleAddCompletedHike = (data: any) => {
    const userId = user?.id || 'guest';
    const updated = addCompletedHike(userId, data);
    setCompletedHikes(updated);
    showToast('Hike adventure successfully logged!');
  };

  const handleDeleteCompletedHike = (hikeId: string) => {
    const userId = user?.id || 'guest';
    const updated = deleteCompletedHike(userId, hikeId);
    setCompletedHikes(updated);
    showToast('Hike log removed');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedTrailId(null);
          setActiveTab(tab);
        }}
        savedCount={savedTrailIds.length}
        completedCount={completedHikes.length}
        user={user}
        onOpenAuth={openLoginModal}
        onLogout={logout}
      />

      {/* Main Page Layout Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Render View Pages */}
        {selectedTrailId ? (
          <TrailDetailsPage
            trailId={selectedTrailId}
            onBack={() => setSelectedTrailId(null)}
            isSaved={savedTrailIds.includes(selectedTrailId)}
            onToggleSave={handleToggleSave}
            onCompleteHike={handleAddCompletedHike}
            userLat={location?.lat}
            userLng={location?.lng}
          />
        ) : activeTab === 'explore' ? (
          <ExplorePage
            savedTrailIds={savedTrailIds}
            onToggleSave={handleToggleSave}
            onSelectTrail={(id) => setSelectedTrailId(id)}
            onRequestLocation={requestLocation}
            userLat={location?.lat}
            userLng={location?.lng}
            isLocating={isLocating}
          />
        ) : activeTab === 'saved' ? (
          <SavedTrailsPage
            savedTrailIds={savedTrailIds}
            onToggleSave={handleToggleSave}
            onSelectTrail={(id) => setSelectedTrailId(id)}
            onExplore={() => {
              setSelectedTrailId(null);
              setActiveTab('explore');
            }}
          />
        ) : activeTab === 'progress' ? (
          <ProgressPage
            completedHikes={completedHikes}
            onDeleteHike={handleDeleteCompletedHike}
            onExplore={() => {
              setSelectedTrailId(null);
              setActiveTab('explore');
            }}
          />
        ) : (
          <ProfilePage
            user={user}
            savedCount={savedTrailIds.length}
            completedHikes={completedHikes}
            onOpenAuth={openLoginModal}
            onLogout={logout}
          />
        )}
      </main>

      {/* Toast Notification Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3 animate-slide-up text-xs font-bold">
          <div className="p-1 rounded-full bg-emerald-500 text-stone-950">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-stone-900 border-t border-stone-800 text-stone-400 py-8 text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <span className="font-bold text-white text-sm block">Hiking Trail Explorer</span>
            <p className="text-stone-500 text-[11px]">
              Discover hiking trails, live mountain weather forecasts, interactive maps, and outdoor fitness logs.
            </p>
          </div>
          <div className="text-[11px] text-stone-500">
            Powered by Open-Meteo & OpenStreetMap • Built with React & TypeScript
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        mode={authMode}
        onClose={closeAuthModal}
        onSwitchMode={setAuthMode}
        onLogin={login}
        onRegister={register}
        onDemoLogin={loginDemo}
      />
    </div>
  );
}
