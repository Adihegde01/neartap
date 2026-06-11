import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, ZoomControl } from 'react-leaflet';
import { useApp } from '../context/AppContext';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { formatDistance } from '../data/mockTaps';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* ── Premium tap pin ── */
function tapIcon(isOpen, isVerified) {
  const bg   = isOpen ? 'linear-gradient(135deg,#1D9E75,#0e7a5a)' : 'linear-gradient(135deg,#374151,#1f2937)';
  const glow = isOpen ? '0 0 16px rgba(29,158,117,0.6), 0 4px 16px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.4)';
  const ring = isVerified && isOpen ? '3px solid rgba(52,211,153,0.5)' : '2.5px solid rgba(255,255,255,0.15)';
  return L.divIcon({
    className: '',
    html: `
      <div style="
        position:relative;
        width:42px; height:42px;
      ">
        <div style="
          width:42px; height:42px; border-radius:50%;
          background:${bg};
          box-shadow:${glow};
          border:${ring};
          display:flex; align-items:center; justify-content:center;
          transition: transform 0.2s;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white" opacity="0.95">
            <path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0C19 10 12 2 12 2z"/>
          </svg>
        </div>
        ${isVerified ? `<div style="
          position:absolute; bottom:-1px; right:-1px;
          width:14px; height:14px; border-radius:50%;
          background:#3b82f6; border:2px solid #0b0e14;
          display:flex; align-items:center; justify-content:center;
        ">
          <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>` : ''}
      </div>`,
    iconSize:    [42, 42],
    iconAnchor:  [21, 42],
    popupAnchor: [0, -48],
  });
}

/* ── Premium "You" dot ── */
const youIcon = L.divIcon({
  className: '',
  html: `
    <div style="position:relative; width:22px; height:22px;">
      <div style="
        position:absolute; inset:-6px; border-radius:50%;
        background:rgba(59,130,246,0.15);
        animation: ping 1.8s cubic-bezier(0,0,0.2,1) infinite;
      "></div>
      <div style="
        width:22px; height:22px; border-radius:50%;
        background:linear-gradient(135deg,#3b82f6,#2563eb);
        border:3px solid white;
        box-shadow:0 0 0 3px rgba(59,130,246,0.3), 0 4px 14px rgba(0,0,0,0.4);
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
  iconSize:   [22, 22],
  iconAnchor: [11, 11],
});

function MapSync({ center, zoom }) {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom, { animate: true, duration: 0.6 }); }, [center, zoom, map]);
  return null;
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
    >
      {/* Dark premium tile layer */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        maxZoom={20}
      />

      <ZoomControl position="bottomright" />
      <MapSync center={mapCenter} zoom={mapZoom} />

      {/* User location */}
      {location && (
        <>
          <Marker position={location} icon={youIcon} />
          <Circle
            center={location}
            radius={500}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.06,
              weight: 1,
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
          icon={tapIcon(tap.isOpenNow ?? tap.isOpen, tap.isVerified)}
        >
          <Popup
            className="neartap-popup"
            closeButton={false}
          >
            <div
              onClick={() => navigate(`/tap/${tap.id}`)}
              style={{
                minWidth: '220px',
                cursor: 'pointer',
                background: 'rgba(10,13,20,0.97)',
                borderRadius: '16px',
                padding: '14px 16px',
                border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: 'inherit',
              }}
            >
              {/* Status dot + name */}
              <div style={{ display:'flex', alignItems:'flex-start', gap:'8px', marginBottom:'8px' }}>
                <div style={{
                  width:'8px', height:'8px', borderRadius:'50%', marginTop:'4px', flexShrink:0,
                  background: (tap.isOpenNow ?? tap.isOpen) ? '#10b981' : '#6b7280',
                  boxShadow: (tap.isOpenNow ?? tap.isOpen) ? '0 0 6px rgba(16,185,129,0.6)' : 'none'
                }} />
                <div>
                  <p style={{ fontWeight:700, color:'#fff', fontSize:'13px', margin:0, lineHeight:'1.3' }}>{tap.name}</p>
                  <p style={{ color:'#4b5563', fontSize:'11px', margin:'3px 0 0', lineHeight:'1.4' }}>{tap.address}</p>
                </div>
              </div>

              {/* Badges */}
              <div style={{ display:'flex', gap:'5px', flexWrap:'wrap', marginBottom:'10px' }}>
                <span style={{
                  background: (tap.isOpenNow ?? tap.isOpen) ? 'rgba(16,185,129,0.15)' : 'rgba(107,114,128,0.15)',
                  color: (tap.isOpenNow ?? tap.isOpen) ? '#34d399' : '#9ca3af',
                  fontSize:'10px', padding:'3px 8px', borderRadius:'99px',
                  border: `1px solid ${(tap.isOpenNow ?? tap.isOpen) ? 'rgba(16,185,129,0.25)' : 'rgba(107,114,128,0.2)'}`,
                  fontWeight: 600,
                }}>
                  {(tap.isOpenNow ?? tap.isOpen) ? '● Open' : '● Closed'}
                </span>
                <span style={{
                  background: tap.isFree ? 'rgba(20,184,166,0.15)' : 'rgba(245,158,11,0.12)',
                  color: tap.isFree ? '#5eead4' : '#fbbf24',
                  fontSize:'10px', padding:'3px 8px', borderRadius:'99px',
                  border: `1px solid ${tap.isFree ? 'rgba(20,184,166,0.25)' : 'rgba(245,158,11,0.2)'}`,
                  fontWeight: 600,
                }}>
                  {tap.isFree ? 'Free' : 'Paid'}
                </span>
                {tap.isVerified && (
                  <span style={{
                    background:'rgba(59,130,246,0.15)', color:'#93c5fd',
                    fontSize:'10px', padding:'3px 8px', borderRadius:'99px',
                    border:'1px solid rgba(59,130,246,0.25)', fontWeight:600,
                  }}>✓ Verified</span>
                )}
              </div>

              {/* Footer */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                {tap.distance != null ? (
                  <span style={{ color:'#1D9E75', fontSize:'11px', fontWeight:700 }}>{formatDistance(tap.distance)}</span>
                ) : <span />}
                <span style={{
                  color:'#1D9E75', fontSize:'11px', fontWeight:700,
                  display:'flex', alignItems:'center', gap:'3px'
                }}>
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
