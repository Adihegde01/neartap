import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Droplets, ShieldCheck, MapPin, Edit3, Trash2, Check, X, AlertTriangle } from 'lucide-react';

export default function AdminDashboardPage() {
  const { taps, editTap, removeTap, clearTapIssues, user } = useApp();
  const [activeTab, setActiveTab] = useState('taps'); // 'taps' | 'issues'
  const [editingTap, setEditingTap] = useState(null);

  // Form states for Editing
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editLat, setEditLat] = useState(12.9716);
  const [editLng, setEditLng] = useState(77.5946);
  const [editHours, setEditHours] = useState('24/7');
  const [editIsFree, setEditIsFree] = useState(false);
  const [editPaymentMethods, setEditPaymentMethods] = useState([]);
  const [editIsAccessible, setEditIsAccessible] = useState(true);
  const [editWaterQuality, setEditWaterQuality] = useState('safe');
  const [editDescription, setEditDescription] = useState('');

  const isAdmin = user && user.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center" style={{ background: '#141820' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-rose-500/10 mb-4">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-sm text-gray-400 max-w-sm">
          You must be logged in as a Super Admin to view this page. Log in with admin credentials to continue.
        </p>
      </div>
    );
  }

  // Calculate Admin Stats
  const totalTaps = taps.length;
  const tapsWithIssues = taps.filter(t => t.issues && t.issues.length > 0);
  const totalIssuesCount = tapsWithIssues.length;
  const verifiedTapsCount = taps.filter(t => t.isVerified).length;

  const handleEditClick = (tap) => {
    setEditingTap(tap);
    setEditName(tap.name || '');
    setEditAddress(tap.address || '');
    setEditLat(tap.lat || 12.9716);
    setEditLng(tap.lng || 77.5946);
    setEditHours(tap.hours || '24/7');
    setEditIsFree(tap.isFree || false);
    setEditPaymentMethods(tap.paymentMethods || []);
    setEditIsAccessible(tap.isAccessible != null ? tap.isAccessible : true);
    setEditWaterQuality(tap.waterQuality || 'safe');
    setEditDescription(tap.description || '');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingTap) return;

    await editTap(editingTap.id, {
      name: editName,
      address: editAddress,
      lat: parseFloat(editLat),
      lng: parseFloat(editLng),
      hours: editHours,
      isFree: editIsFree,
      paymentMethods: editIsFree ? [] : editPaymentMethods,
      isAccessible: editIsAccessible,
      waterQuality: editWaterQuality,
      description: editDescription,
    });

    setEditingTap(null);
  };

  const handleDeleteClick = async (tapId) => {
    if (confirm('Are you sure you want to delete this tap kiosk? This action cannot be undone.')) {
      await removeTap(tapId);
    }
  };

  const handlePaymentCheckbox = (method) => {
    if (editPaymentMethods.includes(method)) {
      setEditPaymentMethods(prev => prev.filter(m => m !== method));
    } else {
      setEditPaymentMethods(prev => [...prev, method]);
    }
  };

  return (
    <div className="page-enter flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: '#141820' }}>
      {/* Header */}
      <div className="border-b border-white/5 bg-slate-900/40 backdrop-blur-md px-6 py-5 sticky top-0 z-10 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <span className="text-teal-400">🛡️</span> Super Admin Control Panel
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage tap kiosks, verify safety, and resolve community reports</p>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Admin stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: '#1b2131', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-500/10 text-teal-400">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{totalTaps}</p>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Tap Kiosks</p>
            </div>
          </div>

          <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: '#1b2131', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{totalIssuesCount}</p>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Taps with Active Issues</p>
            </div>
          </div>

          <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: '#1b2131', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{verifiedTapsCount}</p>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Verified Water Sources</p>
            </div>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-white/5">
          <button
            onClick={() => setActiveTab('taps')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${activeTab === 'taps' ? 'border-teal-400 text-teal-400' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            Manage Taps ({totalTaps})
          </button>
          <button
            onClick={() => setActiveTab('issues')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${activeTab === 'issues' ? 'border-teal-400 text-teal-400' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            Issue Center ({totalIssuesCount})
          </button>
        </div>

        {/* Taps Table View */}
        {activeTab === 'taps' && (
          <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.06)', background: '#1b2131' }}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-slate-900/40 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="px-5 py-4">Kiosk Info</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Hours & Cost</th>
                  <th className="px-5 py-4">Water Quality</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                {taps.map((tap) => (
                  <tr key={tap.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-white">{tap.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{tap.address}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-gray-400">
                        <MapPin className="w-3 h-3 text-teal-400" />
                        {tap.lat.toFixed(4)}, {tap.lng.toFixed(4)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p>{tap.hours || '24/7'}</p>
                      <p className="text-[10px] text-teal-400 mt-0.5 font-semibold">
                        {tap.isFree ? 'Free Kiosk' : `Paid: ${tap.paymentMethods?.join(', ') || 'Coin/UPI'}`}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                        tap.waterQuality === 'safe' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {tap.waterQuality === 'safe' ? 'Safe to Drink' : 'Needs Filtering'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {tap.isVerified && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        )}
                        {tap.issues && tap.issues.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-bold flex items-center gap-1">
                            ⚠️ {tap.issues.length} issue(s)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(tap)}
                          className="p-2 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-colors"
                          title="Edit tap kiosk"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(tap.id)}
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                          title="Delete tap kiosk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Issue Center View */}
        {activeTab === 'issues' && (
          <div className="space-y-4">
            {tapsWithIssues.length === 0 ? (
              <div className="rounded-2xl p-8 text-center" style={{ background: '#1b2131', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-gray-400 text-sm">🎉 No reported issues! All tap kiosks are reported safe.</p>
              </div>
            ) : (
              tapsWithIssues.map(tap => (
                <div
                  key={tap.id}
                  className="rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:bg-white/2"
                  style={{ background: '#1b2131', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{tap.name}</h4>
                      <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full">
                        {tap.issues.length} active report(s)
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{tap.address}</p>
                    <div className="bg-rose-500/5 rounded-xl p-3 border border-rose-500/10">
                      <p className="text-[11px] font-semibold text-rose-300">Reported Issues:</p>
                      <ul className="list-disc list-inside text-xs text-gray-300 mt-1 space-y-1">
                        {tap.issues.map((issue, idx) => (
                          <li key={idx}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={async () => {
                        await clearTapIssues(tap.id);
                        alert('All reported issues for this tap have been resolved/cleared.');
                      }}
                      className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Resolve & Clear
                    </button>
                    <button
                      onClick={() => handleDeleteClick(tap.id)}
                      className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Source
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Editing Dialog Modal */}
      {editingTap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div
            className="w-full max-w-xl rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto"
            style={{ background: '#1b2131', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <button
              onClick={() => setEditingTap(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg transition-colors"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-white mb-4">Edit Water Tap Kiosk</h3>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-semibold mb-1 uppercase tracking-wider">Kiosk Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-white focus:outline-none placeholder:text-gray-600"
                  style={{ background: '#141820', border: '1px solid rgba(255,255,255,0.06)' }}
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1 uppercase tracking-wider">Street Address</label>
                <input
                  type="text"
                  required
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-white focus:outline-none placeholder:text-gray-600"
                  style={{ background: '#141820', border: '1px solid rgba(255,255,255,0.06)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1 uppercase tracking-wider">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={editLat}
                    onChange={(e) => setEditLat(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-white focus:outline-none"
                    style={{ background: '#141820', border: '1px solid rgba(255,255,255,0.06)' }}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-semibold mb-1 uppercase tracking-wider">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={editLng}
                    onChange={(e) => setEditLng(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-white focus:outline-none"
                    style={{ background: '#141820', border: '1px solid rgba(255,255,255,0.06)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1 uppercase tracking-wider">Operational Hours</label>
                  <input
                    type="text"
                    value={editHours}
                    onChange={(e) => setEditHours(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-white focus:outline-none"
                    style={{ background: '#141820', border: '1px solid rgba(255,255,255,0.06)' }}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-semibold mb-1 uppercase tracking-wider">Water Safety Status</label>
                  <select
                    value={editWaterQuality}
                    onChange={(e) => setEditWaterQuality(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-white focus:outline-none bg-slate-900"
                    style={{ background: '#141820', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <option value="safe">Safe / Potable</option>
                    <option value="unsafe">Needs Boiling / Filtering</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Free to use Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#141820', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="font-bold text-white">Free to Use</p>
                    <p className="text-[10px] text-gray-400">Public/community tap</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={editIsFree}
                    onChange={(e) => setEditIsFree(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400"
                  />
                </div>

                {/* Accessible Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#141820', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="font-bold text-white">Wheelchair Accessible</p>
                    <p className="text-[10px] text-gray-400">Ramps / ground level</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={editIsAccessible}
                    onChange={(e) => setEditIsAccessible(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400"
                  />
                </div>
              </div>

              {/* Payment selection panel, only visible if not free */}
              {!editIsFree && (
                <div className="p-3.5 rounded-xl space-y-2.5" style={{ background: '#141820', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <label className="block text-gray-400 font-semibold uppercase tracking-wider">Payment Options</label>
                  <div className="flex gap-4">
                    {['Coin', 'UPI'].map(method => (
                      <label key={method} className="flex items-center gap-2 text-white font-bold cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editPaymentMethods.includes(method)}
                          onChange={() => handlePaymentCheckbox(method)}
                          className="w-3.5 h-3.5 rounded text-teal-500 focus:ring-teal-400"
                        />
                        {method}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-gray-400 font-semibold mb-1 uppercase tracking-wider">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-white focus:outline-none min-h-[60px]"
                  style={{ background: '#141820', border: '1px solid rgba(255,255,255,0.06)' }}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTap(null)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary py-3 font-bold rounded-xl transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
