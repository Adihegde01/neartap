import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapPin, Bookmark } from 'lucide-react';
import { formatDistance } from '../data/mockTaps';

/* Icon shown inside the tap icon box — varies by tap type */
/* Icon shown inside the tap icon box — varies by tap type */
function TapTypeIcon({ name }) {
  const n = name.toLowerCase();
  // School / govt school
  if (n.includes('school') || n.includes('college'))
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    );
  // Temple / trust
  if (n.includes('temple') || n.includes('trust') || n.includes('mandir'))
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="10" width="18" height="11" rx="1"/><path d="M12 2l9 8H3l9-8z"/><rect x="9" y="14" width="6" height="7"/>
      </svg>
    );
  // Ward / office
  if (n.includes('ward') || n.includes('office') || n.includes('govt') || n.includes('bbmp') || n.includes('municipal'))
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="1"/><path d="M16 22V12a1 1 0 00-1-1H9a1 1 0 00-1 1v10"/><path d="M22 7l-10-5L2 7"/>
      </svg>
    );
  // Default — water drop
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#2563EB">
      <path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0C19 10 12 2 12 2z"/>
    </svg>
  );
}

/* Map tap metadata to pill labels matching the reference */
function getTags(tap) {
  const tags = [];
  if (tap.isOpenNow ?? tap.isOpen) {
    if (tap.hours === '24/7')    tags.push({ label: 'Open 24 hr', cls: 'pill-green' });
    else                          tags.push({ label: 'Open', cls: 'pill-green' });
  } else {
    tags.push({ label: 'Closed', cls: 'pill-gray' });
  }
  if (tap.isVerified)             tags.push({ label: 'Govt verified', cls: 'pill-blue' });
  if (tap.confirmations >= 3 && !tap.isVerified) tags.push({ label: 'Tested', cls: 'pill-teal' });
  if (!tap.isFree) {
    const methods = (tap.paymentMethods || []).map(m => m === 'coin' ? 'Coin' : m.toUpperCase()).join('/');
    tags.push({ label: `Paid (${methods || 'Coin/UPI'})`, cls: 'pill-amber' });
  }
  if (tap.hours && tap.hours !== '24/7' && !tap.isOpenNow) tags.push({ label: tap.hours, cls: 'pill-gray' });
  if ((tap.issues || []).length > 0) tags.push({ label: 'Issue reported', cls: 'pill-red' });
  return tags.slice(0, 3); // max 3 pills per reference
}

export default function TapCard({ tap, isFirst = false }) {
  const navigate  = useNavigate();
  const { savedTaps, toggleSave } = useApp();
  const isSaved   = savedTaps.includes(tap.id);
  const tags      = getTags(tap);

  const handleSave = (e) => { e.stopPropagation(); toggleSave(tap.id); };

  return (
    <div
      className={isFirst ? 'tap-card-active' : 'tap-card'}
      onClick={() => navigate(`/tap/${tap.id}`)}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start gap-3">
        {/* Icon box */}
        <div className="tap-icon-box flex-shrink-0">
          <TapTypeIcon name={tap.name} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Row 1: name + distance */}
          <div className="flex items-start justify-between gap-2">
            <h3
              className="font-bold text-slate-800 leading-snug"
              style={{ fontSize: '15px' }}
            >
              {tap.name}
            </h3>
            <span
              className="flex-shrink-0 font-semibold text-sm"
              style={{ color: '#2563EB' }}
            >
              {tap.distance != null ? formatDistance(tap.distance) : ''}
            </span>
          </div>

          {/* Row 2: address */}
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 flex-shrink-0 text-slate-400" strokeWidth={1.8} />
            <p className="text-xs truncate text-slate-500">{tap.address}</p>
          </div>

          {/* Row 3: tags */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            {tags.map((t, i) => (
              <span key={i} className={`pill ${t.cls}`}>{t.label}</span>
            ))}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="flex-shrink-0 ml-1 p-1"
          aria-label={isSaved ? 'Unsave' : 'Save'}
        >
          <Bookmark
            className="w-4 h-4 transition-colors"
            strokeWidth={isSaved ? 0 : 1.8}
            style={{ color: isSaved ? '#2563EB' : '#94A3B8', fill: isSaved ? '#2563EB' : 'none' }}
          />
        </button>
      </div>
    </div>
  );
}
