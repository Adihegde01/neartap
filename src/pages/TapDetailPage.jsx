import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import {
  ArrowLeft, Bookmark, Navigation, MapPin, Clock, Droplets,
  ShieldCheck, ShieldAlert, ThumbsUp, AlertTriangle, Share2,
  CheckCircle, Image, Coins
} from 'lucide-react';
import { formatDistance } from '../data/mockTaps';
import { format } from 'date-fns';

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color:'#1D9E75' }} strokeWidth={1.8} />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color:'#6b7280' }}>{label}</p>
        <p className="text-sm" style={{ color:'#d1d5db' }}>{value}</p>
      </div>
    </div>
  );
}

export default function TapDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { taps, savedTaps, toggleSave, user, confirmTap, reportIssue, signIn } = useApp();
  const [showReport, setShowReport] = useState(false);
  const [issueText, setIssueText]   = useState('');
  const [confirmed, setConfirmed]   = useState(false);
  const [reported, setReported]     = useState(false);
  const [photoIdx, setPhotoIdx]     = useState(0);

  const tap = taps.find(t => t.id === id);
  if (!tap) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4" style={{ background:'#141820' }}>
      <Droplets className="w-14 h-14" style={{ color:'#1D9E75', opacity:0.3 }} />
      <p style={{ color:'#9ca3af' }}>Tap not found</p>
      <button className="btn-primary" onClick={() => navigate('/')}>Go Home</button>
    </div>
  );

  const isSaved = savedTaps.includes(tap.id);

  const handleConfirm = () => {
    if (!user) { signIn(); return; }
    if (confirmed) return;
    confirmTap(tap.id); setConfirmed(true);
  };
  const handleReport = () => {
    if (!user) { signIn(); return; }
    if (!issueText.trim()) return;
    reportIssue(tap.id, issueText.trim());
    setIssueText(''); setShowReport(false); setReported(true);
  };
  const handleShare = async () => {
    if (navigator.share) await navigator.share({ title: tap.name, url: window.location.href });
    else await navigator.clipboard.writeText(window.location.href);
  };

  const isOpen = tap.isOpenNow ?? tap.isOpen;

  return (
    <div className="page-enter flex flex-col min-h-screen pb-24 md:pb-8" style={{ background:'#141820' }}>
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col px-0 md:px-4">
        {/* Hero */}
        <div className="relative flex-shrink-0 md:rounded-3xl md:overflow-hidden md:mt-6" style={{ height: window.innerWidth >= 768 ? '300px' : '240px' }}>
          {tap.photos?.length > 0 ? (
            <>
              <img src={tap.photos[photoIdx]} alt={tap.name} className="w-full h-full object-cover" />
              {tap.photos.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {tap.photos.map((_, i) => (
                    <button key={i} onClick={() => setPhotoIdx(i)}
                      className={`h-1.5 rounded-full transition-all ${i===photoIdx?'w-4 bg-white':'w-1.5 bg-white/40'}`}/>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background:'#1b2131' }}>
              <Image className="w-14 h-14" style={{ color:'#374151' }} strokeWidth={1} />
            </div>
          )}
          <div className="absolute inset-0" style={{ background:'linear-gradient(to top, rgba(20,24,32,0.9) 0%, transparent 50%)' }} />

          {/* Top actions */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center pt-10 md:pt-4">
            <button onClick={() => navigate(-1)}
              className="p-2 rounded-xl backdrop-blur-sm"
              style={{ background:'rgba(20,24,32,0.7)', border:'1px solid rgba(255,255,255,0.1)' }}>
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex gap-2">
              <button onClick={handleShare}
                className="p-2 rounded-xl backdrop-blur-sm"
                style={{ background:'rgba(20,24,32,0.7)', border:'1px solid rgba(255,255,255,0.1)' }}>
                <Share2 className="w-5 h-5 text-white" />
              </button>
              <button onClick={() => toggleSave(tap.id)}
                className="p-2 rounded-xl backdrop-blur-sm"
                style={{ background:'rgba(20,24,32,0.7)', border:'1px solid rgba(255,255,255,0.1)' }}>
                <Bookmark className="w-5 h-5"
                  style={{ color: isSaved?'#1D9E75':'#fff', fill: isSaved?'#1D9E75':'none' }}
                  strokeWidth={isSaved?0:1.8} />
              </button>
            </div>
          </div>

          {/* Bottom name/status */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className={`pill ${isOpen?'pill-green':'pill-gray'}`}>
                <span className="status-dot" style={{ background: isOpen?'#1D9E75':'#6b7280', width:6, height:6, borderRadius:'50%', display:'inline-block' }} />
                {isOpen ? 'Open' : 'Closed'}
              </span>
              {tap.isVerified && (
                <span className="pill pill-blue"><ShieldCheck className="w-3 h-3" /> Verified</span>
              )}
            </div>
            <h1 className="text-xl font-black text-white">{tap.name}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 pt-4 w-full md:px-0">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label:'Distance',   value: tap.distance ? formatDistance(tap.distance) : 'N/A', color:'#1D9E75' },
              { label:'Confirmed',  value: tap.confirmations,                                    color:'#60a5fa' },
              { label:'Issues',     value: (tap.issues||[]).length,                              color:'#fbbf24' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-2xl p-3 text-center" style={{ background:'#1b2131', border:'1px solid rgba(255,255,255,0.06)' }}>
                <p className="font-bold text-xl" style={{ color }}>{value}</p>
                <p className="text-xs" style={{ color:'#6b7280' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Info card */}
          <div className="rounded-2xl px-4 mb-4" style={{ background:'#1b2131', border:'1px solid rgba(255,255,255,0.06)' }}>
            <InfoRow icon={MapPin} label="Address" value={tap.address} />
            <InfoRow icon={Clock}  label="Hours"   value={tap.hours} />
            <InfoRow icon={Droplets} label="Water Quality" value={tap.waterQuality || 'Unknown'} />
            <InfoRow
              icon={Coins}
              label="Payment / Cost"
              value={tap.isFree ? 'Free to use' : `Paid (${(tap.paymentMethods || []).map(m => m === 'coin' ? 'Coin' : m.toUpperCase()).join(', ') || 'Coin / UPI'})`}
            />
            {tap.description && (
              <div className="py-3">
                <p className="text-sm leading-relaxed" style={{ color:'#9ca3af' }}>{tap.description}</p>
              </div>
            )}
          </div>

          {/* Verification progress */}
          {!tap.isVerified && (
            <div className="rounded-2xl p-4 mb-4" style={{ background:'#1b2131', border:'1px solid rgba(245,158,11,0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-4 h-4" style={{ color:'#fbbf24' }} />
                <p className="text-xs font-semibold" style={{ color:'#fbbf24' }}>
                  Needs {Math.max(0,3-(tap.confirmations||0))} more confirmation{Math.max(0,3-(tap.confirmations||0))!==1?'s':''} for Verified badge
                </p>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'#252d3d' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width:`${Math.min(100,((tap.confirmations||0)/3)*100)}%`, background:'#1D9E75' }} />
              </div>
            </div>
          )}

          {/* Last confirmed */}
          {tap.lastReportedWorking && (
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-3.5 h-3.5" style={{ color:'#1D9E75' }} />
              <p className="text-xs" style={{ color:'#6b7280' }}>
                Last confirmed working: {format(new Date(tap.lastReportedWorking), 'dd MMM yyyy')}
              </p>
            </div>
          )}

          {/* Issues */}
          {(tap.issues||[]).length > 0 && (
            <div className="rounded-2xl p-4 mb-4" style={{ background:'#1b2131', border:'1px solid rgba(239,68,68,0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4" style={{ color:'#fca5a5' }} />
                <p className="text-sm font-semibold" style={{ color:'#fca5a5' }}>Reported Issues</p>
              </div>
              {tap.issues.map((iss, i) => (
                <p key={i} className="text-xs pl-3 mb-1 border-l-2" style={{ color:'#9ca3af', borderColor:'rgba(239,68,68,0.3)' }}>{iss}</p>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button onClick={handleConfirm} disabled={confirmed} className="w-full btn-primary py-3.5">
              <ThumbsUp className="w-4 h-4" />
              {confirmed ? 'Thanks for confirming!' : 'Confirm it works'}
            </button>
            <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${tap.lat},${tap.lng}`,'_blank')} className="w-full btn-secondary py-3.5">
              <Navigation className="w-4 h-4" />
              Get Directions
            </button>
            <button onClick={() => {
              if (!user) { signIn(); return; }
              setShowReport(v=>!v);
            }}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200"
              style={{ background: reported?'rgba(29,158,117,0.1)':'rgba(239,68,68,0.08)', color: reported?'#4dd6a3':'#fca5a5', border:`1px solid ${reported?'rgba(29,158,117,0.2)':'rgba(239,68,68,0.2)'}` }}>
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {reported ? 'Issue Reported — Thank you!' : 'Report an Issue'}
              </div>
            </button>

            {showReport && !reported && (
              <div className="rounded-2xl p-4 animate-fade-in" style={{ background:'#1b2131', border:'1px solid rgba(239,68,68,0.2)' }}>
                <textarea
                  value={issueText} onChange={e=>setIssueText(e.target.value)}
                  placeholder="e.g. Water discolored, tap broken, no pressure…"
                  rows={3}
                  className="w-full bg-transparent text-sm outline-none resize-none mb-3"
                  style={{ color:'#d1d5db', borderBottom:'1px solid rgba(255,255,255,0.08)', paddingBottom:'8px' }}
                />
                <div className="flex gap-2">
                  <button onClick={()=>setShowReport(false)} className="flex-1 btn-ghost text-sm">Cancel</button>
                  <button onClick={handleReport} className="flex-1 btn-primary text-sm">Submit</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
