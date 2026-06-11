import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, signInWithGoogle, signOutUser, db, doc, getDoc } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { MOCK_TAPS, calcDistance, isOpenNow } from '../data/mockTaps';
import * as api from '../api/client';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('neartap_logged_user')) || null;
    } catch (e) {
      return null;
    }
  });
  const [idToken, setIdToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [taps, setTaps] = useState(MOCK_TAPS);
  const [savedTaps, setSavedTaps] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('neartap_saved_taps')) || [];
    } catch (e) {
      return [];
    }
  });
  const [activeFilters, setActiveFilters] = useState(['all']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTap, setSelectedTap] = useState(null);
  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]);
  const [mapZoom, setMapZoom] = useState(13);
  const [showMockLogin, setShowMockLogin] = useState(false);

  // Sync savedTaps to localStorage
  useEffect(() => {
    localStorage.setItem('neartap_saved_taps', JSON.stringify(savedTaps));
  }, [savedTaps]);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const token = await u.getIdToken();
          setIdToken(token);

          // Query the 'admins' collection in Firestore using the user's email
          let role = 'user';
          try {
            const adminDocRef = doc(db, 'admins', u.email.toLowerCase());
            const adminSnap = await getDoc(adminDocRef);
            if (adminSnap.exists()) {
              role = 'admin';
            }
          } catch (dbErr) {
            console.warn('Failed to query admins collection in Firestore:', dbErr);
          }

          const userWithRole = {
            uid: u.uid,
            displayName: u.displayName,
            email: u.email,
            photoURL: u.photoURL,
            role: role
          };
          setUser(userWithRole);
          localStorage.setItem('neartap_logged_user', JSON.stringify(userWithRole));
        } catch (e) {
          console.error('Failed to process auth state:', e);
          setIdToken('demo');
          setUser(u);
        }
      } else {
        setIdToken('demo');
        setUser(null);
        localStorage.removeItem('neartap_logged_user');
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // Geolocation
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setLocation(coords);
        setMapCenter(coords);
        setMapZoom(14);
        setLocationError(null);
      },
      (err) => {
        setLocationError('Location access denied. Showing demo data around Bengaluru.');
        // Fall back to Bangalore
        setLocation([12.9716, 77.5946]);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => { requestLocation(); }, [requestLocation]);

  // Load taps from Go REST API
  const loadTaps = useCallback(async () => {
    try {
      const data = await api.fetchTaps();
      if (data) {
        setTaps(data);
      }
    } catch (err) {
      console.warn('API error, falling back to local mock data:', err);
    }
  }, []);

  useEffect(() => {
    loadTaps();
  }, [loadTaps]);

  // Derived: taps with distances & filters applied
  const tapsWithMeta = taps.map(tap => ({
    ...tap,
    distance: location ? calcDistance(location[0], location[1], tap.lat, tap.lng) : null,
    isOpenNow: isOpenNow(tap.hours),
  })).sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));

  const filteredTaps = tapsWithMeta.filter(tap => {
    if (activeFilters.includes('all') && !searchQuery) return true;

    let passesFilter = activeFilters.includes('all');
    if (activeFilters.includes('open'))       passesFilter = passesFilter || tap.isOpenNow;
    if (activeFilters.includes('verified'))   passesFilter = passesFilter || tap.isVerified;
    if (activeFilters.includes('free'))       passesFilter = passesFilter || tap.isFree;

    if (!passesFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        tap.name.toLowerCase().includes(q) ||
        tap.address.toLowerCase().includes(q) ||
        tap.waterQuality?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleFilter = (filter) => {
    if (filter === 'all') {
      setActiveFilters(['all']);
    } else {
      setActiveFilters(prev => {
        const without = prev.filter(f => f !== 'all');
        if (without.includes(filter)) {
          const next = without.filter(f => f !== filter);
          return next.length === 0 ? ['all'] : next;
        }
        return [...without, filter];
      });
    }
  };

  const toggleSave = (tapId) => {
    setSavedTaps(prev =>
      prev.includes(tapId) ? prev.filter(id => id !== tapId) : [...prev, tapId]
    );
  };

  const addTap = async (tapData) => {
    try {
      const created = await api.createTap(tapData, idToken || 'demo');
      setTaps(prev => [created, ...prev]);
      return created;
    } catch (err) {
      console.warn('Failed to add tap via API, adding locally:', err);
      const newTap = {
        ...tapData,
        id: String(Date.now()),
        addedBy: user ? { uid: user.uid, name: user.displayName, photoURL: user.photoURL } : { uid: 'anon', name: 'Anonymous' },
        confirmations: 0,
        issues: [],
        lastReportedWorking: new Date().toISOString(),
        photos: tapData.photos || [],
        isOpen: isOpenNow(tapData.hours),
      };
      setTaps(prev => [newTap, ...prev]);
      return newTap;
    }
  };

  const reportIssue = async (tapId, issue) => {
    try {
      const updated = await api.reportIssue(tapId, issue, idToken || 'demo');
      setTaps(prev => prev.map(t => t.id === tapId ? updated : t));
    } catch (err) {
      console.warn('Failed to report issue via API, reporting locally:', err);
      setTaps(prev =>
        prev.map(t =>
          t.id === tapId ? { ...t, issues: [...(t.issues || []), issue] } : t
        )
      );
    }
  };

  const confirmTap = async (tapId) => {
    try {
      const updated = await api.confirmTap(tapId, idToken || 'demo');
      setTaps(prev => prev.map(t => t.id === tapId ? updated : t));
    } catch (err) {
      console.warn('Failed to confirm tap via API, confirming locally:', err);
      setTaps(prev =>
        prev.map(t => {
          if (t.id !== tapId) return t;
          const newCount = (t.confirmations || 0) + 1;
          return { ...t, confirmations: newCount, isVerified: newCount >= 3 };
        })
      );
    }
  };

  const editTap = async (tapId, tapData) => {
    try {
      const updated = await api.updateTap(tapId, tapData, idToken || 'demo');
      setTaps(prev => prev.map(t => t.id === tapId ? updated : t));
      return updated;
    } catch (err) {
      console.warn('Failed to update tap via API, updating locally:', err);
      setTaps(prev => prev.map(t => {
        if (t.id !== tapId) return t;
        return { ...t, ...tapData, isOpen: isOpenNow(tapData.hours) };
      }));
    }
  };

  const removeTap = async (tapId) => {
    try {
      await api.deleteTap(tapId, idToken || 'demo');
      setTaps(prev => prev.filter(t => t.id !== tapId));
    } catch (err) {
      console.warn('Failed to delete tap via API, deleting locally:', err);
      setTaps(prev => prev.filter(t => t.id !== tapId));
    }
  };

  const clearTapIssues = async (tapId) => {
    try {
      const updated = await api.resolveIssues(tapId, idToken || 'demo');
      setTaps(prev => prev.map(t => t.id === tapId ? updated : t));
    } catch (err) {
      console.warn('Failed to clear issues via API, clearing locally:', err);
      setTaps(prev => prev.map(t => t.id === tapId ? { ...t, issues: [] } : t));
    }
  };

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.warn('Firebase Auth unconfigured or invalid API key. Launching mock login.', e);
      setShowMockLogin(true);
    }
  };
  const signOut = async () => {
    try {
      await signOutUser();
    } catch (e) {
      console.warn('Signout failed, clearing state locally:', e);
    }
    setUser(null);
    localStorage.removeItem('neartap_logged_user');
    setIdToken(null);
  };

  // Initialize local users database in localStorage if not present
  useEffect(() => {
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('neartap_users')) || [];
    } catch (e) {
      users = [];
    }

    const defaultUsers = [
      { uid: 'demo-admin', name: 'Super Admin', email: 'admin@neartap.org', password: 'admin123', role: 'admin', photoURL: '' },
      { uid: 'demo-aarav', name: 'Aarav Sharma', email: 'aarav.sharma@neartap.org', password: 'password123', role: 'user', photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop' },
      { uid: 'demo-vikram', name: 'Vikram Rao', email: 'vikram.rao@neartap.org', password: 'password123', role: 'user', photoURL: '' }
    ];

    let updated = false;
    defaultUsers.forEach(defUser => {
      if (!users.some(u => u.email.toLowerCase() === defUser.email.toLowerCase())) {
        users.push(defUser);
        updated = true;
      }
    });

    if (updated || !localStorage.getItem('neartap_users')) {
      localStorage.setItem('neartap_users', JSON.stringify(users));
    }
  }, []);

  const registerLocally = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('neartap_users') || '[]');
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email is already registered.');
    }
    const isNewAdmin = email.toLowerCase() === 'admin@neartap.org';
    const newUser = {
      uid: 'custom-' + Date.now(),
      name,
      email: email.toLowerCase(),
      password,
      role: isNewAdmin ? 'admin' : 'user',
      photoURL: '',
    };
    users.push(newUser);
    localStorage.setItem('neartap_users', JSON.stringify(users));
    
    const loggedUser = { uid: newUser.uid, displayName: newUser.name, email: newUser.email, role: newUser.role, photoURL: newUser.photoURL };
    setUser(loggedUser);
    localStorage.setItem('neartap_logged_user', JSON.stringify(loggedUser));
    setIdToken('demo');
    setShowMockLogin(false);
    return loggedUser;
  };

  const loginLocally = (email, password) => {
    const users = JSON.parse(localStorage.getItem('neartap_users') || '[]');
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!matched) {
      throw new Error('No account found with this email.');
    }
    if (matched.password !== password) {
      throw new Error('Incorrect password.');
    }
    const loggedUser = { uid: matched.uid, displayName: matched.name, email: matched.email, role: matched.role || 'user', photoURL: matched.photoURL };
    setUser(loggedUser);
    localStorage.setItem('neartap_logged_user', JSON.stringify(loggedUser));
    setIdToken('demo');
    setShowMockLogin(false);
    return loggedUser;
  };

  const resetPasswordLocally = (email, newPassword) => {
    const users = JSON.parse(localStorage.getItem('neartap_users') || '[]');
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) {
      throw new Error('No account found with this email.');
    }
    users[idx].password = newPassword;
    localStorage.setItem('neartap_users', JSON.stringify(users));
    setShowMockLogin(false);
  };

  return (
    <AppContext.Provider value={{
      user, authLoading, signIn, signOut,
      showMockLogin, setShowMockLogin, loginLocally, registerLocally, resetPasswordLocally,
      location, locationError, requestLocation,
      taps: tapsWithMeta, filteredTaps,
      savedTaps, toggleSave,
      activeFilters, toggleFilter,
      searchQuery, setSearchQuery,
      selectedTap, setSelectedTap,
      mapCenter, setMapCenter, mapZoom, setMapZoom,
      addTap, reportIssue, confirmTap,
      editTap, removeTap, clearTapIssues,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
