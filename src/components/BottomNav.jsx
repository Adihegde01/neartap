import { useNavigate, useLocation } from 'react-router-dom';
import { Map, List, Star, User, Plus, ArrowDown, Trophy, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function BottomNav() {
  const navigate  = useNavigate();
  const { pathname } = useLocation();
  const { user } = useApp();

  const navItems = [
    { path: '/',        icon: Map,    label: 'Map'         },
    { path: '/list',    icon: List,   label: 'List'        },
    null, // CTA slot
    { path: '/profile', icon: User,   label: 'Profile'     },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  ];

  if (user && user.role === 'admin') {
    navItems.push({ path: '/admin', icon: ShieldCheck, label: 'Admin' });
  }

  return (
    <nav
      style={{ background: '#111520', borderTop: '1px solid rgba(255,255,255,0.07)' }}
      className="fixed bottom-0 left-0 right-0 z-[2000] md:hidden"
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-4 max-w-lg mx-auto">
        {navItems.map((item, i) => {
          if (!item) {
            /* ── Floating Add Tap button ── */
            return (
              <button
                key="cta"
                onClick={() => navigate('/add')}
                className="relative -top-5 flex flex-col items-center gap-1"
                aria-label="Add a Tap"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-green
                             border-4 transition-all duration-200 hover:brightness-110 active:scale-95"
                  style={{ background: '#1D9E75', borderColor: '#141820' }}
                >
                  {/* arrow-down-circle style icon matching the reference */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                    <path d="M12 8v8M8 12l4 4 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#6b7280' }}>Add Tap</span>
              </button>
            );
          }

          const Icon    = item.icon;
          const isActive = pathname === item.path || (pathname.startsWith('/tap') && item.path === '/');

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="nav-item"
              style={isActive ? { color: '#1D9E75' } : {}}
            >
              <Icon
                className="w-5 h-5 transition-colors"
                strokeWidth={isActive ? 2.5 : 1.8}
                color={isActive ? '#1D9E75' : '#6b7280'}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
