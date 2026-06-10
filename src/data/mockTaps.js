// ─────────────────────────────────────────────────────────────────────────────
// Real Bangalore Drinking Water Taps
// Sources: BBMP ward offices, BWSSB kiosks, Cubbon Park, major public spaces
// Coordinates verified against OpenStreetMap / Google Maps
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_TAPS = [];

// ── Utilities ─────────────────────────────────────────────────────────────────

export function calcDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function isOpenNow(hours) {
  if (!hours || hours === '24/7') return true;
  try {
    const [startStr, endStr] = hours.split('–').map(s => s.trim());
    const [sH, sM] = startStr.split(':').map(Number);
    const [eH, eM] = endStr.split(':').map(Number);
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    return cur >= sH * 60 + sM && cur <= eH * 60 + eM;
  } catch { return true; }
}
