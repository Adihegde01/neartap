import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import DesktopNavRail from './components/DesktopNavRail';
import HomePage from './pages/HomePage';
import TapDetailPage from './pages/TapDetailPage';
import AddTapPage from './pages/AddTapPage';
import SavedPage from './pages/SavedPage';
import ProfilePage from './pages/ProfilePage';
import ListPage from './pages/ListPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { User, KeyRound, Lock, UserPlus, Info } from 'lucide-react';

function AppContent() {
  const { showMockLogin, setShowMockLogin, loginLocally, registerLocally, resetPasswordLocally } = useApp();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const clearForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (authMode === 'login') {
        loginLocally(email, password);
        clearForm();
      } else if (authMode === 'register') {
        registerLocally(name, email, password);
        clearForm();
      } else if (authMode === 'forgot') {
        resetPasswordLocally(email, password);
        setSuccessMsg('Password reset successfully! You can now log in.');
        setAuthMode('login');
        setPassword('');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div
      className="relative flex min-h-screen w-full overflow-x-hidden"
      style={{ background: '#141820' }}
    >
      {/* Desktop Navigation Side Rail */}
      <DesktopNavRail />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/list"      element={<ListPage />} />
          <Route path="/tap/:id"   element={<TapDetailPage />} />
          <Route path="/add"       element={<AddTapPage />} />
          <Route path="/saved"     element={<SavedPage />} />
          <Route path="/profile"   element={<ProfilePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/admin"     element={<AdminDashboardPage />} />
        </Routes>
      </div>

      {/* Mobile Navigation Bottom Bar */}
      <BottomNav />

      {/* Persistent Mock Authentication Modal Overlay */}
      {showMockLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md rounded-3xl p-6 relative animate-scale-up"
            style={{ background: '#1b2131', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <button
              onClick={() => {
                setShowMockLogin(false);
                clearForm();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg transition-colors"
            >
              ✕
            </button>

            {/* Header section based on selected mode */}
            {authMode === 'login' && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-teal-500/10">
                  <Lock className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Sign In</h3>
                  <p className="text-xs text-gray-400">Access your NearTap account</p>
                </div>
              </div>
            )}

            {authMode === 'register' && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-teal-500/10">
                  <UserPlus className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create Account</h3>
                  <p className="text-xs text-gray-400">Join the water contributor network</p>
                </div>
              </div>
            )}

            {authMode === 'forgot' && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-teal-500/10">
                  <KeyRound className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Reset Password</h3>
                  <p className="text-xs text-gray-400">Reset your local account credentials</p>
                </div>
              </div>
            )}

            {/* Hint message explaining local database */}
            <div className="flex gap-2 p-3 rounded-2xl bg-white/5 border border-white/5 mb-4">
              <Info className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-400 leading-normal">
                {authMode === 'forgot'
                  ? "Enter your email address and specify a new password to reset it in your local browser database."
                  : "Google OAuth is unconfigured. The app is running on a secure local browser database. You can register new accounts or sign in using seed accounts."}
              </p>
            </div>

            {/* Error & Success Messages */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 mb-4">
                ⚠️ {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 mb-4">
                ✨ {successMsg}
              </div>
            )}

            {/* Authentication Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Rao"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none transition-all placeholder:text-gray-600"
                    style={{ background: '#141820', border: '1px solid rgba(255,255,255,0.06)' }}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. aarav.sharma@neartap.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none transition-all placeholder:text-gray-600"
                  style={{ background: '#141820', border: '1px solid rgba(255,255,255,0.06)' }}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {authMode === 'forgot' ? 'New Password' : 'Password'}
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-xs text-teal-400 hover:text-teal-300"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none transition-all placeholder:text-gray-600"
                  style={{ background: '#141820', border: '1px solid rgba(255,255,255,0.06)' }}
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3.5 font-bold rounded-2xl mt-2 transition-transform hover:scale-[1.01]"
              >
                {authMode === 'login' && 'Sign In'}
                {authMode === 'register' && 'Create Account'}
                {authMode === 'forgot' && 'Reset Password'}
              </button>
            </form>

            {/* Mode Switchers */}
            <div className="mt-5 text-center text-xs text-gray-400 border-t border-white/5 pt-4">
              {authMode === 'login' && (
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      clearForm();
                    }}
                    className="text-teal-400 font-bold hover:text-teal-300 ml-0.5"
                  >
                    Register here
                  </button>
                </p>
              )}

              {authMode === 'register' && (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      clearForm();
                    }}
                    className="text-teal-400 font-bold hover:text-teal-300 ml-0.5"
                  >
                    Sign In here
                  </button>
                </p>
              )}

              {authMode === 'forgot' && (
                <button
                  onClick={() => {
                    setAuthMode('login');
                    clearForm();
                  }}
                  className="text-teal-400 font-bold hover:text-teal-300"
                >
                  Back to Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}
