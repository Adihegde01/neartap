import { useRef, useState, useEffect } from 'react';
import { Search, Locate, Droplets, SlidersHorizontal, X, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MapView from '../components/MapView';
import FilterChips from '../components/FilterChips';

export default function HomePage() {
  const {
    taps, filteredTaps, searchQuery, setSearchQuery,
    requestLocation, locationError,
    setMapCenter, setMapZoom, setSelectedTap
  } = useApp();

  const inputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      setSearching(true);
      const matchingTaps = taps.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.address.toLowerCase().includes(searchQuery.toLowerCase())
      ).map(t => ({
        type: 'tap', id: `tap-${t.id}`, name: t.name, sub: t.address,
        lat: t.lat, lng: t.lng, raw: t
      }));
      setSuggestions(matchingTaps);
      setSearching(false);
    }, 200);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, taps]);

  const handleSelectSuggestion = (s) => {
    setMapCenter([s.lat, s.lng]);
    setMapZoom(16);
    if (s.type === 'tap') setSelectedTap(s.raw);
    setSearchQuery(s.name);
    setSuggestions([]);
    inputRef.current?.blur();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#F1F5F9' }}>
      <div className="w-full h-full z-0">
        <MapView />
      </div>

      {/* ── Floating Control Panel ── */}
      <div className="absolute top-4 left-4 right-4 md:left-6 md:right-auto md:w-[400px] z-[1000] flex flex-col gap-2">
        <div
          className="rounded-3xl overflow-hidden shadow-xl transition-all duration-300"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(24px)',
            border: searchFocused ? '1px solid rgba(37,99,235,0.4)' : '1px solid #E2E8F0',
            boxShadow: searchFocused
              ? '0 0 0 3px rgba(37,99,235,0.1), 0 12px 40px rgba(0,0,0,0.08)'
              : '0 12px 40px rgba(0,0,0,0.08)',
          }}
        >
          {/* Logo Row */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', boxShadow: '0 0 16px rgba(37,99,235,0.3)' }}
              >
                <Droplets className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight leading-none" style={{ color: '#0F172A' }}>
                  Ha<span className="text-blue-600">ನಿ</span>
                </h1>
                <p className="text-[9px] font-semibold tracking-widest uppercase mt-0.5" style={{ color: '#2563EB' }}>Bengaluru</p>
              </div>
            </div>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-bold"
              style={{ background: 'rgba(37,99,235,0.08)', color: '#2563EB', border: '1px solid rgba(37,99,235,0.15)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              {filteredTaps.length} Taps
            </div>
          </div>

          {/* Search bar */}
          <div className="px-4 pb-3">
            <div
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl transition-all duration-200"
              style={{
                background: searchFocused ? 'rgba(37,99,235,0.04)' : '#F8FAFC',
                border: searchFocused ? '1px solid rgba(37,99,235,0.3)' : '1px solid #E2E8F0',
              }}
            >
              {searching
                ? <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin flex-shrink-0" />
                : <Search className="w-4 h-4 flex-shrink-0" style={{ color: searchFocused ? '#2563EB' : '#94A3B8' }} />
              }
              <input
                ref={inputRef}
                type="text"
                placeholder="Search water taps..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 bg-transparent text-sm outline-none font-medium"
                style={{ color: '#0F172A' }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSuggestions([]); }}
                  className="w-5 h-5 rounded-full flex items-center justify-center transition-all hover:bg-slate-100"
                  style={{ color: '#94A3B8' }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter toggle */}
          <div className="px-4 pb-4 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(v => !v)}
              className="flex items-center gap-1.5 text-xs font-semibold transition-all"
              style={{ color: showFilters ? '#2563EB' : '#94A3B8' }}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>
            {filteredTaps.length > 0 && (
              <span className="text-[10px] font-medium" style={{ color: '#CBD5E1' }}>
                Showing {filteredTaps.length} of {taps.length}
              </span>
            )}
          </div>

          {showFilters && (
            <div className="px-4 pb-4 border-t border-slate-100 pt-3">
              <FilterChips />
            </div>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div
            className="rounded-3xl overflow-hidden shadow-xl"
            style={{
              background: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(24px)',
              border: '1px solid #E2E8F0',
            }}
          >
            <p className="text-[9px] font-bold uppercase tracking-widest px-4 pt-3 pb-1" style={{ color: '#CBD5E1' }}>
              Water Taps Found
            </p>
            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
              {suggestions.slice(0, 8).map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectSuggestion(s)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all hover:bg-blue-50/50 group"
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)' }}
                  >
                    <Droplets className="w-4 h-4" style={{ color: '#2563EB' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold leading-tight truncate" style={{ color: '#0F172A' }}>{s.name}</p>
                    <p className="text-[10px] mt-0.5 truncate" style={{ color: '#94A3B8' }}>{s.sub}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 transition-colors" style={{ color: '#CBD5E1' }} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>



      {/* ── Location Error Toast ── */}
      {locationError && (
        <div
          className="absolute bottom-36 left-4 right-4 md:bottom-8 md:left-6 md:right-auto md:max-w-sm z-[1000] rounded-2xl px-4 py-3 text-xs shadow-lg animate-fade-in flex items-center gap-2"
          style={{
            background: 'rgba(254,226,226,0.95)',
            color: '#DC2626',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <span>⚠</span>
          <span>{locationError}</span>
        </div>
      )}
    </div>
  );
}
