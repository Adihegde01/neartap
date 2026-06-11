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

  if (user && (user.role === 'admin' || user.email === 'adihegde111@gmail.com')) {
    navItems.push({ path: '/admin', icon: ShieldCheck, label: 'Admin' });
  }

  return (
    <div
      className="hidden md:flex flex-col items-center justify-between w-24 min-h-screen py-8 flex-shrink-0 z-[2000]"
      style={{ background: '#FFFFFF', borderRight: '1px solid #E2E8F0' }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform hover:scale-105" style={{ background: 'rgba(37,99,235,0.08)' }}>
          <Droplets className="w-6 h-6" style={{ color: '#2563EB' }} />
        </div>
        <span className="text-[10px] font-black text-slate-800 tracking-tight mt-1">
          Ha<span className="text-blue-600">ನಿ</span>
        </span>
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
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:bg-slate-50"
                style={{
                  background: isActive ? 'rgba(37,99,235,0.08)' : 'transparent',
                  border: isActive ? '1.5px solid rgba(37,99,235,0.35)' : '1.5px solid transparent'
                }}
              >
                <Icon
                  className="w-5 h-5 transition-colors"
                  style={{ color: isActive ? '#2563EB' : '#94A3B8' }}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </div>
              <span
                className="text-[10px] font-semibold transition-colors mt-0.5"
                style={{ color: isActive ? '#2563EB' : '#94A3B8' }}
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
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
        >
          <Plus className="w-6 h-6 text-white" />
        </div>
        <span className="text-[10px] font-bold mt-1" style={{ color: '#2563EB' }}>Add Tap</span>
      </button>
    </div>
  );
}
