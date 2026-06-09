import { useNavigate, useLocation } from 'react-router-dom';
import { Map, List, Star, User, Plus, Droplets, Trophy, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DesktopNavRail() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useApp();

  const navItems = [
    { path: '/',        icon: Map,    label: 'Map'         },
    { path: '/list',    icon: List,   label: 'List'        },
    { path: '/profile', icon: User,   label: 'Profile'     },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  ];

  if (user && user.role === 'admin') {
    navItems.push({ path: '/admin', icon: ShieldCheck, label: 'Admin' });
  }

  return (
    <div
      className="hidden md:flex flex-col items-center justify-between w-24 min-h-screen py-8 flex-shrink-0 z-[2000]"
      style={{ background: '#111520', borderRight: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform hover:scale-105" style={{ background: 'rgba(29,158,117,0.15)' }}>
          <Droplets className="w-6 h-6" style={{ color: '#1D9E75' }} />
        </div>
        <span className="text-[10px] font-black text-white/95 tracking-tight mt-1">NearTap</span>
      </div>

      {/* Nav links */}
      <div className="flex flex-col gap-8">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (pathname.startsWith('/tap') && item.path === '/');
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 group focus:outline-none"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:bg-white/5"
                style={{
                  background: isActive ? 'rgba(29,158,117,0.12)' : 'transparent',
                  border: isActive ? '1.5px solid rgba(29,158,117,0.35)' : '1.5px solid transparent'
                }}
              >
                <Icon
                  className="w-5 h-5 transition-colors"
                  style={{ color: isActive ? '#1D9E75' : '#6b7280' }}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </div>
              <span
                className="text-[10px] font-semibold transition-colors mt-0.5"
                style={{ color: isActive ? '#1D9E75' : '#6b7280' }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Add Tap CTA */}
      <button
        onClick={() => navigate('/add')}
        className="flex flex-col items-center gap-1 group focus:outline-none"
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-green transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ background: '#1D9E75' }}
        >
          <Plus className="w-6 h-6 text-white" />
        </div>
        <span className="text-[10px] font-bold mt-1" style={{ color: '#1D9E75' }}>Add Tap</span>
      </button>
    </div>
  );
}
