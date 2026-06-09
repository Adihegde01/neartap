import { useApp } from '../context/AppContext';
import TapCard from '../components/TapCard';
import FilterChips from '../components/FilterChips';
import { Search, Droplets } from 'lucide-react';

export default function ListPage() {
  const { filteredTaps, searchQuery, setSearchQuery } = useApp();

  return (
    <div className="page-enter flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: '#0b0e14' }}>
      {/* Header */}
      <div className="flex-shrink-0 border-b border-white/5 bg-slate-900/40 backdrop-blur-md px-6 py-5 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <span className="text-teal-400">💧</span> Water Kiosks List
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Explore safe drinking water sources in Bengaluru</p>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl w-full md:w-72" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: '#6b7280' }} />
            <input
              type="text"
              placeholder="Search area or landmark..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-xs outline-none text-white placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full px-6 pt-6 pb-3 flex-shrink-0">
        <FilterChips />
      </div>

      <div className="max-w-3xl mx-auto w-full px-6 pb-4 flex-shrink-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
          Nearby Water Sources — {filteredTaps.length} Found
        </p>
      </div>

      <div className="max-w-3xl mx-auto w-full flex-1 overflow-y-auto px-6 pb-4 space-y-4">
        {filteredTaps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 rounded-3xl border border-white/5" style={{ background: 'rgba(27, 33, 49, 0.3)' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-teal-500/10 text-teal-400">
              <Droplets className="w-6 h-6 text-teal-400" />
            </div>
            <p className="text-sm font-bold text-white">No taps found</p>
            <p className="text-xs text-gray-500">Try matching different search terms or filter configurations</p>
          </div>
        ) : (
          filteredTaps.map((tap, i) => (
            <TapCard key={tap.id} tap={tap} isFirst={i === 0} />
          ))
        )}
      </div>
    </div>
  );
}
