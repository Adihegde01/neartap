import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import TapCard from '../components/TapCard';
import { User, LogOut, LogIn, MapPin, Droplets, ShieldCheck, Plus, ChevronRight } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, signIn, signOut, taps, savedTaps } = useApp();
  const [showAbout, setShowAbout] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  const myTaps = user ? taps.filter(t => t.addedBy?.uid === user.uid) : [];
  const mySavedTaps = taps.filter(t => (savedTaps || []).includes(t.id));

  return (
    <div className="page-enter flex flex-col min-h-screen pb-24 md:pb-8" style={{ background:'#141820' }}>
      {/* Header */}
      <div className="px-4 pt-10 pb-6 flex-shrink-0" style={{ background:'#1D9E75' }}>
        <div className="max-w-3xl mx-auto w-full">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/25 shadow-lg flex-shrink-0">
                {user.photoURL
                  ? <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center" style={{ background:'rgba(0,0,0,0.2)' }}><User className="w-8 h-8 text-white" /></div>}
              </div>
              <div>
                <h1 className="text-xl font-black text-white">{user.displayName}</h1>
                <p className="text-sm" style={{ color:'rgba(255,255,255,0.75)' }}>{user.email}</p>
                <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background:'rgba(0,0,0,0.2)', color:'rgba(255,255,255,0.9)' }}>
                  Community Contributor
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background:'rgba(0,0,0,0.2)' }}>
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black text-white">Guest</h1>
                <p className="text-xs" style={{ color:'rgba(255,255,255,0.75)' }}>Sign in to track contributions</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 px-4 pt-5 max-w-3xl mx-auto w-full space-y-5">
        {/* Sign in CTA */}
        {!user && (
          <button onClick={signIn} className="w-full btn-primary py-3.5">
            <LogIn className="w-4 h-4" /> Sign in with Google
          </button>
        )}

        {/* Stats */}
        {user && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label:'Taps Added', value: myTaps.length, color:'#1D9E75' },
              { label:'Verified',   value: myTaps.filter(t=>t.isVerified).length, color:'#60a5fa' },
              { label:'Impact',     value: myTaps.reduce((s,t)=>s+(t.confirmations||0),0), color:'#fbbf24' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-2xl p-3 text-center" style={{ background:'#1b2131', border:'1px solid rgba(255,255,255,0.06)' }}>
                <p className="font-bold text-xl" style={{ color }}>{value}</p>
                <p className="text-xs" style={{ color:'#6b7280' }}>{label}</p>
              </div>
            ))}
          </div>
        )}



        {/* My taps */}
        {user && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-white">My Contributions</p>
              <span className="text-xs" style={{ color:'#6b7280' }}>{myTaps.length} taps</span>
            </div>
            {myTaps.length === 0 ? (
              <div className="rounded-2xl p-6 text-center" style={{ background:'#1b2131', border:'1px solid rgba(255,255,255,0.06)' }}>
                <MapPin className="w-8 h-8 mx-auto mb-2" style={{ color:'#374151' }} />
                <p className="text-sm mb-3" style={{ color:'#6b7280' }}>No taps added yet</p>
                <button onClick={() => navigate('/add')} className="btn-primary mx-auto text-sm">
                  <Plus className="w-4 h-4" /> Add Your First Tap
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myTaps.map((tap, i) => <TapCard key={tap.id} tap={tap} isFirst={i===0} />)}
              </div>
            )}
          </div>
        )}

        {/* Saved Taps */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-white">Saved Water Sources</p>
            <span className="text-xs text-gray-500">{mySavedTaps.length} saved</span>
          </div>
          {mySavedTaps.length === 0 ? (
            <div className="rounded-2xl p-6 text-center" style={{ background:'#1b2131', border:'1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs text-gray-500">No saved taps yet. Toggle the bookmark icon on any water source to save it here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mySavedTaps.map((tap, i) => (
                <TapCard key={tap.id} tap={tap} isFirst={i===0} />
              ))}
            </div>
          )}
        </div>

        {/* Settings links */}
        <div className="rounded-2xl divide-y" style={{ background:'#1b2131', border:'1px solid rgba(255,255,255,0.06)', divideColor:'rgba(255,255,255,0.05)' }}>
          {[
            { label:'About NearTap',   desc:'Mission & open-source info', icon: Droplets,  onClick: () => setShowAbout(true)  },
            { label:'Data Policy',     desc:'How we use your data',        icon: ShieldCheck, onClick: () => setShowPolicy(true) },
          ].map(({ label, desc, icon: Icon, onClick }) => (
            <button key={label} onClick={onClick} className="flex items-center gap-3 w-full px-4 py-3.5 group">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:'rgba(29,158,117,0.12)' }}>
                <Icon className="w-4 h-4" style={{ color:'#1D9E75' }} strokeWidth={1.8} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs" style={{ color:'#6b7280' }}>{desc}</p>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color:'#374151' }} />
            </button>
          ))}
        </div>

        {user && (
          <button onClick={signOut} className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all" style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#fca5a5' }}>
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        )}

        <p className="text-center text-xs pb-2" style={{ color:'#374151' }}>
          NearTap v1.0 · Map © OpenStreetMap · Community-powered
        </p>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl p-6 relative animate-scale-up" style={{ background: '#1b2131', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => setShowAbout(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(29,158,117,0.15)' }}>
                <Droplets className="w-5 h-5" style={{ color: '#1D9E75' }} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">About NearTap</h3>
                <p className="text-xs text-gray-400">Community Water Locator</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
              <p>
                NearTap is a community-driven initiative built to address drinking water accessibility in Bengaluru. By listing public water ATMs (BWSSB/BBMP), community taps, and trust-run points, we help citizens and workers find clean water near their location.
              </p>
              <p>
                Users can confirm whether taps are functional, report water quality/pressure issues, or submit newly discovered taps directly on the map.
              </p>
              <p className="text-xs text-gray-500 pt-2 border-t border-white/5">
                Built with React, Leaflet, Tailwind CSS, Go (Golang) and Firebase.
              </p>
            </div>
            <button onClick={() => setShowAbout(false)} className="w-full btn-primary mt-6 py-3">Got it</button>
          </div>
        </div>
      )}

      {/* Policy Modal */}
      {showPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl p-6 relative animate-scale-up" style={{ background: '#1b2131', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => setShowPolicy(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>
            <h3 className="text-lg font-black text-white mb-4">Data Policy</h3>
            <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
              <p>
                NearTap respects your privacy. We only use your browser's GPS coordinates to display nearby taps on the map; your location coordinates are never saved to our servers.
              </p>
              <p>
                When you log in with Google to submit or verify a tap, we only store your basic user profile (name, email, and photo URL) to credit your contributions and prevent spam/misuse.
              </p>
            </div>
            <button onClick={() => setShowPolicy(false)} className="w-full btn-primary mt-6 py-3">Accept</button>
          </div>
        </div>
      )}
    </div>
  );
}
