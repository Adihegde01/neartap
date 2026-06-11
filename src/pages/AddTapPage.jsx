import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft, MapPin, Clock, Droplets, Camera,
  CheckSquare, Loader2, ChevronDown
} from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const pinIcon = L.divIcon({
  className:'',
  html:`<div style="width:32px;height:32px;background:#1D9E75;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px rgba(29,158,117,0.5);border:2.5px solid white">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0C19 10 12 2 12 2z"/></svg>
  </div>`,
  iconSize:[32,32], iconAnchor:[16,32],
});

function PinSelector({ position, setPosition, setHasClickedMap }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      setHasClickedMap(true);
    }
  });
  return position ? <Marker position={position} icon={pinIcon} /> : null;
}

const HOURS = ['24/7','06:00 – 20:00','06:00 – 22:00','08:00 – 18:00','09:00 – 21:00','05:30 – 23:30','Custom'];
const QUALITY = ['Municipal','RO Purified','Filtered','Unknown'];

function FieldLabel({ children }) {
  return <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:'#6b7280' }}>{children}</p>;
}

export default function AddTapPage() {
  const navigate = useNavigate();
  const { user, signIn, addTap, location, mapCenter } = useApp();
  const [form, setForm] = useState({ name:'', address:'', hours:'24/7', customHours:'', isFree:false, paymentMethods:[], isAccessible:false, waterQuality:'Municipal', description:'' });
  const [pin, setPin]           = useState(location || mapCenter);
  const [hasClickedMap, setHasClickedMap] = useState(false);
  const [photo, setPhoto]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [errors, setErrors]     = useState({});
  const [hoursOpen, setHoursOpen] = useState(false);
  const fileRef = useRef(null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handlePaymentMethodToggle = (method) => {
    setForm(p => {
      const current = p.paymentMethods || [];
      const updated = current.includes(method)
        ? current.filter(m => m !== method)
        : [...current, method];
      return { ...p, paymentMethods: updated };
    });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name = 'Name is required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!pin)                 e.pin = 'Pick a location on the map';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { signIn(); return; }
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);

    let finalPin = pin;
    if (!hasClickedMap && form.address.trim()) {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.address.trim() + ', Bengaluru')}&limit=1`;
        const res = await fetch(url, {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'NearTap-App/1.0'
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            finalPin = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          } else {
            setErrors(p => ({ ...p, address: 'Could not resolve this address. Please tap the map to pin it manually.' }));
            setLoading(false);
            return;
          }
        } else {
          setErrors(p => ({ ...p, address: 'Address lookup service unavailable. Please pin it manually on the map.' }));
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Geocoding address failed:', err);
        setErrors(p => ({ ...p, address: 'Error looking up address. Please pin it manually on the map.' }));
        setLoading(false);
        return;
      }
    }

    await new Promise(r => setTimeout(r, 800));
    const hours = form.hours === 'Custom' ? (form.customHours || '24/7') : form.hours;
    addTap({ name:form.name.trim(), address:form.address.trim(), lat:finalPin[0], lng:finalPin[1], hours, isFree:form.isFree, paymentMethods:form.isFree ? [] : form.paymentMethods, isAccessible:form.isAccessible, waterQuality:form.waterQuality, description:form.description.trim(), photos: photo ? [photo] : [] });
    setLoading(false); setSuccess(true);
    setTimeout(() => navigate('/'), 1800);
  };

  return (
    <div className="page-enter flex flex-col min-h-screen pb-24 md:pb-8" style={{ background:'#141820' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-10 pb-4 md:py-8 flex-shrink-0" style={{ background:'#1D9E75' }}>
        <div className="max-w-3xl mx-auto w-full flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl" style={{ background:'rgba(0,0,0,0.15)' }}>
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="font-bold text-white text-lg">Add a Tap</h1>
            <p className="text-xs" style={{ color:'rgba(255,255,255,0.75)' }}>Help others find clean water</p>
          </div>
        </div>
      </div>

      {/* Main Content wrapper */}
      <div className="max-w-3xl mx-auto w-full flex-1 px-4 pt-5">
        {/* Auth gate */}
        {!user && (
          <div className="rounded-2xl p-5 text-center mb-6" style={{ background:'rgba(29,158,117,0.1)', border:'1px solid rgba(29,158,117,0.25)' }}>
            <Droplets className="w-8 h-8 mx-auto mb-2" style={{ color:'#1D9E75' }} />
            <p className="font-semibold text-white mb-1">Sign in to contribute</p>
            <p className="text-xs mb-4" style={{ color:'#9ca3af' }}>Google account required to add taps</p>
            <button onClick={signIn} className="btn-primary mx-auto">Sign in with Google</button>
          </div>
        )}

        {success ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center animate-bounce-in" style={{ background:'rgba(29,158,117,0.15)', border:'2px solid #1D9E75' }}>
              <CheckSquare className="w-10 h-10" style={{ color:'#1D9E75' }} />
            </div>
            <h2 className="text-xl font-bold text-white">Tap Added!</h2>
            <p className="text-sm text-center" style={{ color:'#9ca3af' }}>Now visible on the map. Thank you for helping the community!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
            {/* Left side on desktop: Map + Photo */}
            <div className="space-y-5">
              {/* Map pin */}
              <div>
                <FieldLabel><MapPin className="inline w-3.5 h-3.5 mr-1" style={{ color:'#1D9E75' }} />Tap Location — tap the map</FieldLabel>
                <div className="rounded-2xl overflow-hidden" style={{ height:250, border:'1px solid rgba(255,255,255,0.08)' }}>
                  <MapContainer center={pin || mapCenter} zoom={14} style={{ height:'100%', width:'100%' }} zoomControl={false}>
                    <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <PinSelector position={pin} setPosition={setPin} setHasClickedMap={setHasClickedMap} />
                  </MapContainer>
                </div>
                {pin && <p className="text-xs mt-1.5 font-mono" style={{ color:'#1D9E75' }}>{pin[0].toFixed(5)}, {pin[1].toFixed(5)}</p>}
                {errors.pin && <p className="text-xs mt-1" style={{ color:'#fca5a5' }}>{errors.pin}</p>}
              </div>

              {/* Photo */}
              <div>
                <FieldLabel><Camera className="inline w-3.5 h-3.5 mr-1" style={{ color:'#1D9E75' }} />Add Photo (optional)</FieldLabel>
                <input ref={fileRef} type="file" accept="image/*" onChange={e=>{ const f=e.target.files[0]; if(f) setPhoto(URL.createObjectURL(f)); }} className="hidden" />
                <button type="button" onClick={()=>fileRef.current?.click()}
                  className="w-full rounded-2xl p-5 text-center transition-colors"
                  style={{ border:'1.5px dashed rgba(255,255,255,0.1)' }}>
                  {photo ? (
                    <>
                      <img src={photo} alt="Preview" className="w-full h-32 object-cover rounded-xl mb-2" />
                      <p className="text-xs" style={{ color:'#1D9E75' }}>Tap to change photo</p>
                    </>
                  ) : (
                    <>
                      <Camera className="w-8 h-8 mx-auto mb-2" style={{ color:'#374151' }} />
                      <p className="text-sm" style={{ color:'#6b7280' }}>Tap to upload a photo</p>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right side on desktop: Form Inputs */}
            <div className="space-y-5">
              {/* Name */}
              <div>
                <FieldLabel>Tap Name *</FieldLabel>
                <input type="text" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Central Park Fountain"
                  className="input-field" style={{ borderColor: errors.name?'rgba(239,68,68,0.5)':undefined }} />
                {errors.name && <p className="text-xs mt-1" style={{ color:'#fca5a5' }}>{errors.name}</p>}
              </div>

              {/* Address */}
              <div>
                <FieldLabel>Address / Landmark *</FieldLabel>
                <input type="text" value={form.address} onChange={e=>set('address',e.target.value)} placeholder="e.g. Near Gate 3, Lodi Garden"
                  className="input-field" style={{ borderColor: errors.address?'rgba(239,68,68,0.5)':undefined }} />
                {errors.address && <p className="text-xs mt-1" style={{ color:'#fca5a5' }}>{errors.address}</p>}
              </div>

              {/* Hours */}
              <div>
                <FieldLabel><Clock className="inline w-3.5 h-3.5 mr-1" style={{ color:'#1D9E75' }} />Operating Hours</FieldLabel>
                <div className="relative">
                  <button type="button" onClick={()=>setHoursOpen(v=>!v)}
                    className="input-field flex items-center justify-between w-full text-left" style={{ color:'#d1d5db' }}>
                    <span>{form.hours}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${hoursOpen?'rotate-180':''}`} style={{ color:'#6b7280' }} />
                  </button>
                  {hoursOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-10 rounded-2xl overflow-hidden shadow-xl" style={{ background:'#1b2131', border:'1px solid rgba(255,255,255,0.08)' }}>
                      {HOURS.map(h => (
                        <button key={h} type="button" onClick={()=>{set('hours',h);setHoursOpen(false);}}
                          className="w-full text-left px-4 py-3 text-sm transition-colors"
                          style={{ color: form.hours===h?'#1D9E75':'#d1d5db', background: form.hours===h?'rgba(29,158,117,0.1)':'transparent', fontWeight: form.hours===h?600:400 }}>
                          {h}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {form.hours==='Custom' && (
                  <input type="text" value={form.customHours} onChange={e=>set('customHours',e.target.value)} placeholder="e.g. 07:00 – 19:00" className="input-field mt-2" />
                )}
              </div>

              {/* Water quality */}
              <div>
                <FieldLabel><Droplets className="inline w-3.5 h-3.5 mr-1" style={{ color:'#1D9E75' }} />Water Quality</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {QUALITY.map(q => (
                    <button key={q} type="button" onClick={()=>set('waterQuality',q)}
                      className={form.waterQuality===q?'chip-on':'chip-off'}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>

               {/* Toggles */}
              <div className="grid grid-cols-2 gap-3">
                {[{k:'isFree',l:'Free to use'},{k:'isAccessible',l:'Wheelchair'}].map(({k,l})=>(
                  <button key={k} type="button" onClick={()=>set(k,!form[k])}
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-medium transition-all"
                    style={{ background: form[k]?'rgba(29,158,117,0.15)':'#1b2131', border:`1px solid ${form[k]?'rgba(29,158,117,0.4)':'rgba(255,255,255,0.08)'}`, color: form[k]?'#4dd6a3':'#9ca3af' }}>
                    <div className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all"
                      style={{ background:form[k]?'#1D9E75':'transparent', borderColor:form[k]?'#1D9E75':'#4b5563' }}>
                      {form[k]&&<svg viewBox="0 0 10 8" className="w-2.5" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                    </div>
                    {l}
                  </button>
                ))}
              </div>

              {/* Payment Methods sub-selector */}
              {!form.isFree && (
                <div className="p-4 rounded-2xl space-y-3 animate-fade-in" style={{ background: '#1b2131', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <FieldLabel>Accepted Payment Methods</FieldLabel>
                  <div className="flex gap-2">
                    {[{k:'coin', l:'Coin Operated'}, {k:'upi', l:'UPI / QR Code'}].map(({k,l}) => {
                      const isActive = (form.paymentMethods || []).includes(k);
                      return (
                        <button key={k} type="button" onClick={() => handlePaymentMethodToggle(k)}
                          className="flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                          style={{
                            background: isActive ? 'rgba(29,158,117,0.12)' : '#141820',
                            border: `1.5px solid ${isActive ? 'rgba(29,158,117,0.4)' : 'rgba(255,255,255,0.06)'}`,
                            color: isActive ? '#4dd6a3' : '#9ca3af'
                          }}
                        >
                          <div className="w-3.5 h-3.5 rounded-full border flex items-center justify-center" style={{ borderColor: isActive ? '#1D9E75' : '#4b5563', background: isActive ? '#1D9E75' : 'transparent' }}>
                            {isActive && <svg viewBox="0 0 10 8" className="w-2" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>}
                          </div>
                          {l}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <FieldLabel>Description (optional)</FieldLabel>
                <textarea value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Any useful details…" rows={2} className="input-field resize-none" />
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-base font-bold">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting…</> : <><Droplets className="w-5 h-5" /> Add This Tap</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
