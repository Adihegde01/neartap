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
        type: 'tap',
        id: `tap-${t.id}`,
        name: t.name,
        sub: t.address,
        lat: t.lat,
        lng: t.lng,
        raw: t
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
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#0b0e14' }}>

      {/* ── Fullscreen Map ── */}
      <div className="w-full h-full z-0">
        <MapView />
      </div>

      {/* ── Top gradient fade ── */}
      <div
        className="absolute top-0 left-0 right-0 h-40 z-[500] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(11,14,20,0.7) 0%, transparent 100%)' }}
      />

      {/* ── Floating Control Panel ── */}
      <div className="absolute top-4 left-4 right-4 md:left-6 md:right-auto md:w-[400px] z-[1000] flex flex-col gap-2">

        {/* Logo + Search Card */}
        <div
          className="rounded-3xl overflow-hidden shadow-2xl transition-all duration-300"
          style={{
            background: 'rgba(10, 13, 20, 0.88)',
            backdropFilter: 'blur(24px)',
            border: searchFocused
              ? '1px solid rgba(29,158,117,0.5)'
              : '1px solid rgba(255,255,255,0.07)',
            boxShadow: searchFocused
              ? '0 0 0 3px rgba(29,158,117,0.12), 0 20px 60px rgba(0,0,0,0.5)'
              : '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Logo Row */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #1D9E75, #0e7a5a)', boxShadow: '0 0 16px rgba(29,158,117,0.4)' }}
              >
                <Droplets className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-sm font-black text-white tracking-tight leading-none">NearTap</h1>
                <p className="text-[9px] font-semibold tracking-widest uppercase mt-0.5" style={{ color: '#1D9E75' }}>Bengaluru</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-bold"
                style={{ background: 'rgba(29,158,117,0.1)', color: '#4dd6a3', border: '1px solid rgba(29,158,117,0.2)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {filteredTaps.length} Taps
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="px-4 pb-3">
            <div
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl transition-all duration-200"
              style={{
                background: searchFocused ? 'rgba(29,158,117,0.06)' : 'rgba(255,255,255,0.04)',
                border: searchFocused ? '1px solid rgba(29,158,117,0.25)' : '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {searching
                ? <div className="w-4 h-4 border-2 border-teal-500/40 border-t-teal-400 rounded-full animate-spin flex-shrink-0" />
                : <Search className="w-4 h-4 flex-shrink-0" style={{ color: searchFocused ? '#1D9E75' : '#4b5563' }} />
              }
              <input
                ref={inputRef}
                type="text"
                placeholder="Search water taps..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-gray-600 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSuggestions([]); }}
                  className="w-5 h-5 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                  style={{ color: '#6b7280' }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter toggle row */}
          <div className="px-4 pb-4 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(v => !v)}
              className="flex items-center gap-1.5 text-xs font-semibold transition-all"
              style={{ color: showFilters ? '#1D9E75' : '#6b7280' }}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>
            {filteredTaps.length > 0 && (
              <span className="text-[10px] font-medium" style={{ color: '#374151' }}>
                Showing {filteredTaps.length} of {taps.length}
              </span>
            )}
          </div>

          {/* Filters (collapsible) */}
          {showFilters && (
            <div className="px-4 pb-4 border-t border-white/5 pt-3">
              <FilterChips />
            </div>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div
            className="rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: 'rgba(10, 13, 20, 0.95)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <p className="text-[9px] font-bold uppercase tracking-widest px-4 pt-3 pb-1" style={{ color: '#374151' }}>
              Water Taps Found
            </p>
            <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
              {suggestions.slice(0, 8).map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectSuggestion(s)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all hover:bg-white/5 group"
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(29,158,117,0.12)', border: '1px solid rgba(29,158,117,0.2)' }}
                  >
                    <Droplets className="w-4 h-4" style={{ color: '#1D9E75' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white leading-tight truncate">{s.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">{s.sub}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-teal-400 transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Locate Me Button ── */}
      <div className="absolute bottom-24 md:bottom-8 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={requestLocation}
          title="Find my location"
          className="w-12 h-12 flex items-center justify-center rounded-2xl shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: 'rgba(10, 13, 20, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <Locate className="w-5 h-5" style={{ color: '#1D9E75' }} />
        </button>
      </div>

      {/* ── Location Error Toast ── */}
      {locationError && (
        <div
          className="absolute bottom-36 left-4 right-4 md:bottom-8 md:left-6 md:right-auto md:max-w-sm z-[1000] rounded-2xl px-4 py-3 text-xs shadow-2xl animate-fade-in flex items-center gap-2"
          style={{
            background: 'rgba(239,68,68,0.1)',
            color: '#fca5a5',
            border: '1px solid rgba(239,68,68,0.2)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <span>⚠</span>
          <span>{locationError}</span>
        </div>
      )}
    </div>
  );
}
