import { useRef, useState, useEffect } from 'react';
import { Search, Locate, Droplets, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MapView from '../components/MapView';

export default function HomePage() {
  const {
    taps, filteredTaps, searchQuery, setSearchQuery,
    requestLocation, locationError,
    setMapCenter, setMapZoom, setSelectedTap
  } = useApp();

  const inputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearching(true);
      try {
        // 1. Search local taps
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

        // 2. Fetch areas from Nominatim OpenStreetMap
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', Bengaluru')}&limit=4`;
        const res = await fetch(url, { 
          headers: { 
            'Accept-Language': 'en',
            'User-Agent': 'NearTap-App/1.0'
          } 
        });
        
        let matchingPlaces = [];
        if (res.ok) {
          const data = await res.json();
          matchingPlaces = data.map(item => {
            const parts = item.display_name.split(',');
            const name = parts[0];
            const sub = parts.slice(1).slice(0, 3).join(',').trim();
            return {
              type: 'place',
              id: `place-${item.place_id}`,
              name,
              sub,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon)
            };
          });
        }

        setSuggestions([...matchingTaps, ...matchingPlaces]);
      } catch (err) {
        console.warn('Geocoding error:', err);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, taps]);

  const handleSelectSuggestion = (s) => {
    setMapCenter([s.lat, s.lng]);
    setMapZoom(15);
    if (s.type === 'tap') {
      setSelectedTap(s.raw);
    }
    setSearchQuery(s.name);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#0b0e14' }}>
      {/* ── Fullscreen Map ── */}
      <div className="w-full h-full z-0">
        <MapView />
      </div>

      {/* ── Floating Control Panel ── */}
      <div 
        className="absolute top-4 left-4 right-4 md:left-6 md:right-auto md:w-[380px] z-[1000] flex flex-col gap-3"
      >
        <div 
          className="rounded-3xl p-4 shadow-2xl transition-all duration-300"
          style={{ 
            background: 'rgba(12, 15, 22, 0.85)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)' 
          }}
        >
          {/* Logo row */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-teal-500/10 text-teal-400">
              <Droplets className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                NearTap <span className="text-[9px] font-bold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded-md">BENGALURU</span>
              </h1>
            </div>
          </div>

          {/* Search bar */}
          <div
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl transition-all duration-300"
            style={{ 
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <Search className="w-4 h-4 flex-shrink-0 text-gray-500" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search area or landmark..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-xs outline-none text-white placeholder:text-gray-500"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => { setSearchQuery(''); setSuggestions([]); }}
                className="text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5"
              >
                Clear
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div 
              className="mt-2 rounded-2xl overflow-hidden shadow-2xl divide-y divide-white/5 max-h-60 overflow-y-auto"
              style={{ 
                background: 'rgba(18, 24, 38, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.08)' 
              }}
            >
              {suggestions.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectSuggestion(s)}
                  className="w-full text-left px-4 py-3 flex items-start gap-2.5 hover:bg-white/5 transition-colors"
                >
                  <span className="mt-0.5 text-teal-400">
                    {s.type === 'tap' ? <Droplets className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">{s.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[280px]">{s.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Tap status snippet */}
          <div className="mt-3 flex items-center justify-between text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
            <span>{filteredTaps.length} Tap sources nearby</span>
            {filteredTaps.length > 0 && <span className="text-teal-400">Map Mode Active</span>}
          </div>
        </div>
      </div>

      {/* ── Floating Action Buttons (Locate me / Navigation help) ── */}
      <div className="absolute bottom-24 md:bottom-6 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={requestLocation}
          title="Find my location"
          className="p-3.5 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          style={{ 
            background: 'rgba(12, 15, 22, 0.85)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)' 
          }}
        >
          <Locate className="w-5 h-5 text-teal-400" />
        </button>
      </div>

      {/* ── Location Error Toast ── */}
      {locationError && (
        <div
          className="absolute bottom-36 left-4 right-4 md:bottom-6 md:left-6 md:right-auto z-[1000] rounded-2xl px-4 py-3 text-xs shadow-2xl animate-fade-in"
          style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: '#fca5a5', 
            border: '1px solid rgba(239, 68, 68, 0.2)',
            backdropFilter: 'blur(20px)'
          }}
        >
          ⚠ {locationError}
        </div>
      )}
    </div>
  );
}
