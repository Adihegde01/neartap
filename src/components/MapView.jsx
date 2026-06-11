import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import { useApp } from '../context/AppContext';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { formatDistance } from '../data/mockTaps';
import { Locate, Plus, Minus } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* ── Blue tap pin ── */
function tapIcon(isOpen) {
  const bg   = isOpen ? 'linear-gradient(135deg,#2563EB,#1D4ED8)' : 'linear-gradient(135deg,#94A3B8,#64748B)';
  const glow = isOpen ? '0 0 14px rgba(37,99,235,0.5), 0 4px 12px rgba(0,0,0,0.15)' : '0 4px 8px rgba(0,0,0,0.12)';
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:40px; height:40px; border-radius:50%;
        background:${bg};
        box-shadow:${glow};
        border:3px solid white;
        display:flex; align-items:center; justify-content:center;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" opacity="0.95">
          <path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0C19 10 12 2 12 2z"/>
        </svg>
      </div>`,
    iconSize:    [40, 40],
    iconAnchor:  [20, 40],
    popupAnchor: [0, -46],
  });
}

/* ── "You" blue dot ── */
const youIcon = L.divIcon({
  className: '',
  html: `
    <div style="position:relative; width:20px; height:20px;">
      <div style="
        position:absolute; inset:-6px; border-radius:50%;
        background:rgba(37,99,235,0.15);
        animation: ping 1.8s cubic-bezier(0,0,0.2,1) infinite;
      "></div>
      <div style="
        width:20px; height:20px; border-radius:50%;
        background:linear-gradient(135deg,#2563EB,#1D4ED8);
        border:3px solid white;
        box-shadow:0 0 0 3px rgba(37,99,235,0.2), 0 4px 12px rgba(0,0,0,0.15);
        position:relative; z-index:1;
      "></div>
    </div>
    <style>
      @keyframes ping {
        0%   { transform: scale(0.8); opacity:0.6; }
        70%  { transform: scale(2);   opacity:0; }
        100% { transform: scale(0.8); opacity:0; }
      }
    </style>`,
  iconSize:   [20, 20],
  iconAnchor: [10, 10],
});

function MapSync({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 0.8 });
  }, [center, zoom, map]);
  return null;
}

function MapControls() {
  const map = useMap();
  const { location, requestLocation } = useApp();

  const handleZoomIn = (e) => {
    e.stopPropagation();
    map.zoomIn(1, { animate: true, duration: 0.35 });
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    map.zoomOut(1, { animate: true, duration: 0.35 });
  };

  const handleRelocate = (e) => {
    e.stopPropagation();
    if (location) {
      map.flyTo(location, 15, {
        animate: true,
        duration: 1.2
      });
    } else {
      requestLocation();
    }
  };

  return (
    <div className="absolute bottom-48 md:bottom-8 right-4 md:right-6 z-[1000] flex flex-col gap-3">
      {/* Relocate/Compass Button */}
      <button
        onClick={handleRelocate}
        className="w-11 h-11 rounded-full bg-white border border-slate-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.18)] hover:text-blue-600 active:scale-95 flex items-center justify-center text-slate-600 transition-all cursor-pointer"
        title="Find my location"
      >
        <Locate className="w-5 h-5" />
      </button>

      {/* Zoom Controls */}
      <div className="flex flex-col rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.12)] overflow-hidden">
        <button
          onClick={handleZoomIn}
          className="w-11 h-11 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all font-bold text-lg border-b border-slate-100 cursor-pointer"
          title="Zoom in"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-11 h-11 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all font-bold text-lg cursor-pointer"
          title="Zoom out"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function MapView() {
  const navigate = useNavigate();
  const { filteredTaps, location, mapCenter, mapZoom } = useApp();

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
      attributionControl={false}
      zoomAnimation={true}
      zoomAnimationThreshold={4}
      fadeAnimation={true}
      markerZoomAnimation={true}
      inertia={true}
      easeLinearity={0.2}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        maxZoom={20}
      />

      <MapControls />
      <MapSync center={mapCenter} zoom={mapZoom} />

      {/* User location */}
      {location && (
        <>
          <Marker position={location} icon={youIcon} />
          <Circle
            center={location}
            radius={500}
            pathOptions={{
              color: '#2563EB',
              fillColor: '#2563EB',
              fillOpacity: 0.06,
              weight: 1.5,
              opacity: 0.3,
              dashArray: '6 4'
            }}
          />
        </>
      )}

      {/* Tap markers */}
      {filteredTaps.map(tap => (
        <Marker
          key={tap.id}
          position={[tap.lat, tap.lng]}
          icon={tapIcon(tap.isOpenNow ?? tap.isOpen)}
        >
          <Popup className="neartap-popup" closeButton={false}>
            <div
              onClick={() => navigate(`/tap/${tap.id}`)}
              style={{
                minWidth: '220px',
                cursor: 'pointer',
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '14px 16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                fontFamily: 'inherit',
              }}
            >
              {/* Status dot + name */}
              <div style={{ display:'flex', alignItems:'flex-start', gap:'8px', marginBottom:'8px' }}>
                <div style={{
                  width:'8px', height:'8px', borderRadius:'50%', marginTop:'4px', flexShrink:0,
                  background: (tap.isOpenNow ?? tap.isOpen) ? '#10B981' : '#94A3B8',
                  boxShadow: (tap.isOpenNow ?? tap.isOpen) ? '0 0 6px rgba(16,185,129,0.5)' : 'none'
                }} />
                <div>
                  <p style={{ fontWeight:700, color:'#0F172A', fontSize:'13px', margin:0, lineHeight:'1.3' }}>{tap.name}</p>
                  <p style={{ color:'#94A3B8', fontSize:'11px', margin:'3px 0 0', lineHeight:'1.4' }}>{tap.address}</p>
                </div>
              </div>

              {/* Badges */}
              <div style={{ display:'flex', gap:'5px', flexWrap:'wrap', marginBottom:'10px' }}>
                <span style={{
                  background: (tap.isOpenNow ?? tap.isOpen) ? 'rgba(16,185,129,0.1)' : '#F1F5F9',
                  color: (tap.isOpenNow ?? tap.isOpen) ? '#059669' : '#94A3B8',
                  fontSize:'10px', padding:'3px 8px', borderRadius:'99px',
                  border: `1px solid ${(tap.isOpenNow ?? tap.isOpen) ? 'rgba(16,185,129,0.2)' : '#E2E8F0'}`,
                  fontWeight: 600,
                }}>
                  {(tap.isOpenNow ?? tap.isOpen) ? '● Open' : '● Closed'}
                </span>
                <span style={{
                  background: tap.isFree ? 'rgba(37,99,235,0.08)' : 'rgba(245,158,11,0.08)',
                  color: tap.isFree ? '#2563EB' : '#D97706',
                  fontSize:'10px', padding:'3px 8px', borderRadius:'99px',
                  border: `1px solid ${tap.isFree ? 'rgba(37,99,235,0.15)' : 'rgba(245,158,11,0.2)'}`,
                  fontWeight: 600,
                }}>
                  {tap.isFree ? 'Free' : 'Paid'}
                </span>
              </div>

              {/* Footer */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                {tap.distance != null ? (
                  <span style={{ color:'#2563EB', fontSize:'11px', fontWeight:700 }}>{formatDistance(tap.distance)}</span>
                ) : <span />}
                <span style={{ color:'#2563EB', fontSize:'11px', fontWeight:700 }}>
                  View details →
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
