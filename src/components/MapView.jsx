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

/* ── Tap pin matching reference design: circle with water drop ── */
function tapIcon(isOpen) {
  const bg    = isOpen ? '#1D9E75' : '#4b5563';
  const glow  = isOpen ? '0 0 14px rgba(29,158,117,0.55)' : 'none';
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:38px; height:38px; border-radius:50%;
        background:${bg}; box-shadow:${glow}, 0 3px 12px rgba(0,0,0,0.4);
        border:2.5px solid rgba(255,255,255,0.3);
        display:flex; align-items:center; justify-content:center;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0C19 10 12 2 12 2z"/>
        </svg>
      </div>`,
    iconSize:    [38, 38],
    iconAnchor:  [19, 38],
    popupAnchor: [0, -42],
  });
}

/* ── "You" blue dot matching reference ── */
const youIcon = L.divIcon({
  className: '',
  html: `
    <div style="position:relative; width:18px; height:18px;">
      <div style="
        width:18px; height:18px; border-radius:50%;
        background:#3b82f6; border:3px solid white;
        box-shadow:0 0 0 5px rgba(59,130,246,0.25), 0 3px 12px rgba(0,0,0,0.3);
      "></div>
    </div>`,
  iconSize:   [18, 18],
  iconAnchor: [9, 9],
});

function MapSync({ center, zoom }) {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom, { animate: true }); }, [center, zoom, map]);
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
      attributionControl={true}
    >
      <ZoomControl position="topright" />
      <MapSync center={mapCenter} zoom={mapZoom} />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User location */}
      {location && (
        <>
          <Marker position={location} icon={youIcon} />
          <Circle
            center={location}
            radius={600}
            pathOptions={{ color:'#3b82f6', fillColor:'#3b82f6', fillOpacity:0.08, weight:1.5, opacity:0.4 }}
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
          <Popup>
            <div
              onClick={() => navigate(`/tap/${tap.id}`)}
              style={{ padding:'12px 14px', minWidth:'200px', cursor:'pointer' }}
            >
              <p style={{ fontWeight:700, color:'#fff', fontSize:'13px', margin:'0 0 4px' }}>{tap.name}</p>
              <p style={{ color:'#9ca3af', fontSize:'11px', margin:'0 0 8px' }}>{tap.address}</p>
              <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'8px' }}>
                <span style={{ background:'rgba(29,158,117,0.2)', color:'#4dd6a3', fontSize:'10px', padding:'2px 8px', borderRadius:'99px', border:'1px solid rgba(29,158,117,0.3)' }}>
                  {(tap.isOpenNow ?? tap.isOpen) ? 'Open' : 'Closed'}
                </span>
                <span style={{ background: tap.isFree ? 'rgba(20,184,166,0.2)' : 'rgba(245,158,11,0.15)', color: tap.isFree ? '#5eead4' : '#fbbf24', fontSize:'10px', padding:'2px 8px', borderRadius:'99px', border: tap.isFree ? '1px solid rgba(20,184,166,0.3)' : '1px solid rgba(245,158,11,0.25)' }}>
                  {tap.isFree ? 'Free' : `Paid (${(tap.paymentMethods || []).map(m => m === 'coin' ? 'Coin' : m.toUpperCase()).join('/') || 'Coin/UPI'})`}
                </span>
                {tap.isVerified && (
                  <span style={{ background:'rgba(59,130,246,0.2)', color:'#93c5fd', fontSize:'10px', padding:'2px 8px', borderRadius:'99px', border:'1px solid rgba(59,130,246,0.3)' }}>Verified</span>
                )}
                {tap.distance != null && (
                  <span style={{ color:'#1D9E75', fontSize:'10px', fontWeight:600 }}>{formatDistance(tap.distance)}</span>
                )}
              </div>
              <p style={{ color:'#1D9E75', fontSize:'11px', fontWeight:600 }}>View details →</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
