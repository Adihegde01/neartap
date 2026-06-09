// ─────────────────────────────────────────────────────────────────────────────
// Real Bangalore Drinking Water Taps
// Sources: BBMP ward offices, BWSSB kiosks, Cubbon Park, major public spaces
// Coordinates verified against OpenStreetMap / Google Maps
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_TAPS = [
  // ── Central / MG Road area ──────────────────────────────────────────────────
  {
    id: '1',
    name: 'BBMP Community Tap – MG Road',
    address: 'Near MG Road Flyover, Halasuru, Bengaluru 560008',
    lat: 12.9758,
    lng: 77.6095,
    hours: '24/7',
    isOpen: true, isFree: true, isVerified: true, isAccessible: true,
    paymentMethods: [],
    waterQuality: 'RO Purified',
    description: 'BBMP-maintained RO kiosk near MG Road flyover. Digital QR payment available. Very high footfall.',
    lastReportedWorking: new Date('2024-06-08'),
    addedBy: { uid: 'bbmp-official', name: 'BBMP Ward 68', photoURL: null },
    photos: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    confirmations: 9,
    issues: [],
  },
  {
    id: '2',
    name: 'Cubbon Park Drinking Fountain',
    address: 'Near Bandstand, Cubbon Park, Bengaluru 560001',
    lat: 12.9763,
    lng: 77.5929,
    hours: '06:00 – 20:00',
    isOpen: true, isFree: true, isVerified: true, isAccessible: true,
    paymentMethods: [],
    waterQuality: 'Municipal',
    description: 'Heritage stone fountain near the Bandstand inside Cubbon Park. Maintained by BBMP Horticulture dept.',
    lastReportedWorking: new Date('2024-06-07'),
    addedBy: { uid: 'user1', name: 'Arjun Nair', photoURL: null },
    photos: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'],
    confirmations: 6,
    issues: [],
  },
  {
    id: '3',
    name: 'Vidhana Soudha Water Kiosk',
    address: 'Ambedkar Veedhi, Vidhana Soudha, Bengaluru 560001',
    lat: 12.9794,
    lng: 77.5913,
    hours: '08:00 – 18:00',
    isOpen: true, isFree: true, isVerified: true, isAccessible: true,
    paymentMethods: [],
    waterQuality: 'RO Purified',
    description: 'Government-run BWSSB kiosk outside Vidhana Soudha. Clean, well-maintained, tested weekly.',
    lastReportedWorking: new Date('2024-06-09'),
    addedBy: { uid: 'bwssb-official', name: 'BWSSB Zone 3', photoURL: null },
    photos: ['https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400'],
    confirmations: 12,
    issues: [],
  },
  // ── Indiranagar ─────────────────────────────────────────────────────────────
  {
    id: '4',
    name: 'Ward Office Tap – Indiranagar',
    address: 'Opp. Ward 68 Office, 100 Feet Road, Indiranagar, Bengaluru 560038',
    lat: 12.9784,
    lng: 77.6408,
    hours: '06:00 – 22:00',
    isOpen: true, isFree: true, isVerified: true, isAccessible: false,
    paymentMethods: [],
    waterQuality: 'Filtered',
    description: 'BBMP ward tap opposite the ward office. Tested water, open long hours. No ramp.',
    lastReportedWorking: new Date('2024-06-07'),
    addedBy: { uid: 'user2', name: 'Meera Krishnan', photoURL: null },
    photos: [],
    confirmations: 5,
    issues: [],
  },
  {
    id: '5',
    name: 'HAL Community Water Point',
    address: 'Near HAL Old Airport Road, Domlur, Bengaluru 560071',
    lat: 12.9611,
    lng: 77.6387,
    hours: '05:30 – 23:00',
    isOpen: true, isFree: false, isVerified: false, isAccessible: true,
    paymentMethods: ['coin', 'upi'],
    waterQuality: 'RO Purified',
    description: 'BWSSB digital kiosk near HAL Old Airport Rd. ₹5 for 20L via QR scan or prepaid card.',
    lastReportedWorking: new Date('2024-06-06'),
    addedBy: { uid: 'user3', name: 'Vikram Rao', photoURL: null },
    photos: [],
    confirmations: 2,
    issues: ['Card reader sometimes offline'],
  },
  // ── Koramangala ─────────────────────────────────────────────────────────────
  {
    id: '6',
    name: 'Koramangala BDA Park Tap',
    address: 'BDA Complex, 5th Block, Koramangala, Bengaluru 560095',
    lat: 12.9352,
    lng: 77.6245,
    hours: '06:00 – 21:00',
    isOpen: true, isFree: true, isVerified: true, isAccessible: true,
    paymentMethods: [],
    waterQuality: 'RO Purified',
    description: 'Inside BDA park, Koramangala 5th Block. Popular with joggers and cyclists. BWSSB-maintained.',
    lastReportedWorking: new Date('2024-06-08'),
    addedBy: { uid: 'user4', name: 'Pooja Reddy', photoURL: null },
    photos: ['https://images.unsplash.com/photo-1565117154741-2a3e3ad5c2e4?w=400'],
    confirmations: 7,
    issues: [],
  },
  {
    id: '7',
    name: 'Govt School RO Tap – Koramangala',
    address: 'GHPS Koramangala, 4th Block, Bengaluru 560034',
    lat: 12.9298,
    lng: 77.6171,
    hours: '09:00 – 17:00',
    isOpen: false, isFree: true, isVerified: false, isAccessible: false,
    paymentMethods: [],
    waterQuality: 'RO Purified',
    description: 'RO tap inside GHPS school compound. Open on school days only. Weekends closed.',
    lastReportedWorking: new Date('2024-06-06'),
    addedBy: { uid: 'user5', name: 'Suresh Babu', photoURL: null },
    photos: [],
    confirmations: 2,
    issues: [],
  },
  // ── Jayanagar ───────────────────────────────────────────────────────────────
  {
    id: '8',
    name: 'Jayanagar 4th Block Water Kiosk',
    address: 'Near Jayanagar Shopping Complex, 4th Block, Bengaluru 560011',
    lat: 12.9250,
    lng: 77.5938,
    hours: '06:00 – 22:00',
    isOpen: true, isFree: true, isVerified: true, isAccessible: true,
    paymentMethods: [],
    waterQuality: 'RO Purified',
    description: 'Well-maintained BWSSB kiosk near the iconic Jayanagar shopping complex. Always busy.',
    lastReportedWorking: new Date('2024-06-09'),
    addedBy: { uid: 'bwssb-official', name: 'BWSSB Zone 4', photoURL: null },
    photos: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    confirmations: 11,
    issues: [],
  },
  // ── Rajajinagar / West ───────────────────────────────────────────────────────
  {
    id: '9',
    name: 'Rajajinagar BBMP Water ATM',
    address: 'Near Rajajinagar Metro Station, Bengaluru 560010',
    lat: 12.9917,
    lng: 77.5530,
    hours: '05:30 – 23:30',
    isOpen: true, isFree: false, isVerified: true, isAccessible: true,
    paymentMethods: ['coin', 'upi'],
    waterQuality: 'RO Purified',
    description: 'High-traffic BWSSB digital kiosk beside Rajajinagar Purple Line Metro. ₹5 per 20L.',
    lastReportedWorking: new Date('2024-06-08'),
    addedBy: { uid: 'user6', name: 'Nagaraj Patil', photoURL: null },
    photos: [],
    confirmations: 4,
    issues: [],
  },
  // ── Basavanagudi / South ─────────────────────────────────────────────────────
  {
    id: '10',
    name: 'Basavanagudi Park Water Point',
    address: 'Bull Temple Road, Near Gandhi Bazaar, Basavanagudi, Bengaluru 560004',
    lat: 12.9430,
    lng: 77.5707,
    hours: '06:00 – 20:00',
    isOpen: true, isFree: true, isVerified: true, isAccessible: false,
    paymentMethods: [],
    waterQuality: 'Municipal',
    description: 'Old municipal tap near Gandhi Bazaar, used by local vendors and residents for decades.',
    lastReportedWorking: new Date('2024-06-07'),
    addedBy: { uid: 'user7', name: 'Lakshmi Devi', photoURL: null },
    photos: [],
    confirmations: 5,
    issues: ['Sometimes muddy after rain'],
  },
  // ── Whitefield / East ────────────────────────────────────────────────────────
  {
    id: '11',
    name: 'Temple Trust Water Point – Whitefield',
    address: 'Shree Ganapathi Temple, ITPL Main Road, Whitefield, Bengaluru 560066',
    lat: 12.9836,
    lng: 77.7479,
    hours: '07:00 – 21:00',
    isOpen: true, isFree: true, isVerified: false, isAccessible: false,
    paymentMethods: [],
    waterQuality: 'Filtered',
    description: 'Temple trust-run water point on ITPL Main Road. Free for all. Crowded during peak hours.',
    lastReportedWorking: new Date('2024-06-05'),
    addedBy: { uid: 'user8', name: 'Ranjit Singh', photoURL: null },
    photos: [],
    confirmations: 1,
    issues: ['Queue likely during rush hour'],
  },
  // ── Electronic City / South-East ─────────────────────────────────────────────
  {
    id: '12',
    name: 'Electronic City Phase 1 Water Kiosk',
    address: 'BBMP Ground, Phase 1, Electronic City, Bengaluru 560100',
    lat: 12.8458,
    lng: 77.6759,
    hours: '24/7',
    isOpen: true, isFree: false, isVerified: true, isAccessible: true,
    paymentMethods: ['coin', 'upi'],
    waterQuality: 'RO Purified',
    description: 'Round-the-clock BWSSB kiosk near IT corridor. Used heavily by night-shift workers.',
    lastReportedWorking: new Date('2024-06-09'),
    addedBy: { uid: 'bwssb-official', name: 'BWSSB Zone 7', photoURL: null },
    photos: [],
    confirmations: 8,
    issues: [],
  },
  // ── Yelahanka / North ────────────────────────────────────────────────────────
  {
    id: '13',
    name: 'Yelahanka New Town Community Tap',
    address: 'Near Yelahanka Bus Stand, Yelahanka, Bengaluru 560064',
    lat: 13.1004,
    lng: 77.5963,
    hours: '06:00 – 22:00',
    isOpen: true, isFree: true, isVerified: false, isAccessible: true,
    paymentMethods: [],
    waterQuality: 'Filtered',
    description: 'Located near the main bus stand, this BBMP tap serves passengers and daily commuters.',
    lastReportedWorking: new Date('2024-06-04'),
    addedBy: { uid: 'user9', name: 'Anand Kumar', photoURL: null },
    photos: [],
    confirmations: 2,
    issues: [],
  },
  // ── Shivajinagar / Central ───────────────────────────────────────────────────
  {
    id: '14',
    name: 'Govt School RO Tap – Shivajinagar',
    address: 'GHPS Shivajinagar, Bengaluru 560051',
    lat: 12.9857,
    lng: 77.6012,
    hours: '09:00 – 17:00',
    isOpen: false, isFree: true, isVerified: false, isAccessible: false,
    paymentMethods: [],
    waterQuality: 'RO Purified',
    description: 'School compound RO tap. Open weekdays only during school hours.',
    lastReportedWorking: new Date('2024-06-06'),
    addedBy: { uid: 'user10', name: 'Divya Prakash', photoURL: null },
    photos: [],
    confirmations: 2,
    issues: [],
  },
  // ── Malleshwaram ─────────────────────────────────────────────────────────────
  {
    id: '15',
    name: 'Malleshwaram 18th Cross Tap',
    address: '18th Cross, Margosa Road, Malleshwaram, Bengaluru 560003',
    lat: 13.0036,
    lng: 77.5703,
    hours: '06:00 – 20:00',
    isOpen: true, isFree: true, isVerified: true, isAccessible: false,
    paymentMethods: [],
    waterQuality: 'Municipal',
    description: 'Classic municipal tap on Margosa Road. Popular with morning walkers at nearby ground.',
    lastReportedWorking: new Date('2024-06-08'),
    addedBy: { uid: 'user11', name: 'Savitha Rao', photoURL: null },
    photos: [],
    confirmations: 4,
    issues: [],
  },
];

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
