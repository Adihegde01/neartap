import { useApp } from '../context/AppContext';
import TapCard from '../components/TapCard';
import { Bookmark, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SavedPage() {
  const navigate = useNavigate();
  const { taps, savedTaps, user, signIn } = useApp();
  const saved = taps.filter(t => savedTaps.includes(t.id));

  return (
    <div className="page-enter flex flex-col min-h-screen pb-24 md:pb-8" style={{ background:'#141820' }}>
      {/* Header */}
      <div className="px-4 pt-10 pb-5 md:py-8 flex-shrink-0" style={{ background:'#1D9E75' }}>
        <div className="max-w-3xl mx-auto w-full flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background:'rgba(0,0,0,0.15)' }}>
            <Bookmark className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Saved Taps</h1>
            <p className="text-xs" style={{ color:'rgba(255,255,255,0.75)' }}>{saved.length} bookmarked</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pt-5 max-w-3xl mx-auto w-full">
        {!user ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background:'#1b2131', border:'1px solid rgba(255,255,255,0.06)' }}>
              <Bookmark className="w-7 h-7" style={{ color:'#374151' }} />
            </div>
            <h2 className="font-bold text-white text-lg">Sign in to save taps</h2>
            <p className="text-sm" style={{ color:'#6b7280' }}>Keep track of your favourite water points</p>
            <button onClick={signIn} className="btn-primary">Sign in with Google</button>
          </div>
        ) : saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background:'#1b2131', border:'1px solid rgba(255,255,255,0.06)' }}>
              <Droplets className="w-7 h-7" style={{ color:'#374151' }} />
            </div>
            <h2 className="font-bold text-white text-lg">No saved taps yet</h2>
            <p className="text-sm" style={{ color:'#6b7280' }}>Bookmark taps to find them quickly later</p>
            <button onClick={() => navigate('/')} className="btn-primary">Explore Taps</button>
          </div>
        ) : (
          <div className="space-y-3">
            {saved.map((tap, i) => <TapCard key={tap.id} tap={tap} isFirst={i === 0} />)}
          </div>
        )}
      </div>
    </div>
  );
}
