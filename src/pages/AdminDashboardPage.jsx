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
  const [editWaterQuality, setEditWaterQuality] = useState('safe');
  const [editDescription, setEditDescription] = useState('');

  const isAdmin = user && (user.role === 'admin' || user.email === 'adihegde111@gmail.com');

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center" style={{ background: '#F1F5F9' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-50 border border-red-100 mb-4">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-sm text-slate-500 max-w-sm">
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
    <div className="page-enter flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: '#F1F5F9' }}>
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/85 backdrop-blur-md px-6 py-5 sticky top-0 z-10 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <span className="text-blue-500">🛡️</span> Super Admin Control Panel
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage tap kiosks, verify safety, and resolve community reports</p>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Admin stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl p-4 flex items-center gap-4 bg-white border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{totalTaps}</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Tap Kiosks</p>
            </div>
          </div>

          <div className="rounded-2xl p-4 flex items-center gap-4 bg-white border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50 text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{totalIssuesCount}</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Taps with Active Issues</p>
            </div>
          </div>

          <div className="rounded-2xl p-4 flex items-center gap-4 bg-white border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{verifiedTapsCount}</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Verified Water Sources</p>
            </div>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('taps')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${activeTab === 'taps' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Manage Taps ({totalTaps})
          </button>
          <button
            onClick={() => setActiveTab('issues')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${activeTab === 'issues' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Issue Center ({totalIssuesCount})
          </button>
        </div>

        {/* Taps Table View */}
        {activeTab === 'taps' && (
          <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-4">Kiosk Info</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Hours & Cost</th>
                  <th className="px-5 py-4">Water Quality</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {taps.map((tap) => (
                  <tr key={tap.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">{tap.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{tap.address}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        {tap.lat.toFixed(4)}, {tap.lng.toFixed(4)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p>{tap.hours || '24/7'}</p>
                      <p className="text-[10px] text-blue-600 mt-0.5 font-semibold">
                        {tap.isFree ? 'Free Kiosk' : `Paid: ${tap.paymentMethods?.join(', ') || 'Coin/UPI'}`}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                        tap.waterQuality === 'safe' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-650 border border-red-200'
                      }`}>
                        {tap.waterQuality === 'safe' ? 'Safe to Drink' : 'Needs Filtering'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {tap.isVerified && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold flex items-center gap-1 border border-emerald-150">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        )}
                        {tap.issues && tap.issues.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold flex items-center gap-1 border border-red-150 animate-pulse">
                            ⚠️ {tap.issues.length} issue(s)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(tap)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Edit tap kiosk"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(tap.id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
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
              <div className="rounded-2xl p-8 text-center bg-white border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-sm">🎉 No reported issues! All tap kiosks are reported safe.</p>
              </div>
            ) : (
              tapsWithIssues.map(tap => (
                <div
                  key={tap.id}
                  className="rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all bg-white border border-slate-200 shadow-sm hover:shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800 text-sm">{tap.name}</h4>
                      <span className="text-[10px] text-red-600 font-bold bg-red-50 border border-red-150 px-2 py-0.5 rounded-full">
                        {tap.issues.length} active report(s)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{tap.address}</p>
                    <div className="bg-red-50/50 rounded-xl p-3 border border-red-100">
                      <p className="text-[11px] font-bold text-red-700">Reported Issues:</p>
                      <ul className="list-disc list-inside text-xs text-slate-650 mt-1 space-y-1">
                        {tap.issues.map((issue, idx) => (
                          <li key={idx} className="text-slate-650 font-medium">{issue}</li>
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
                      className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-150 hover:bg-emerald-100/70 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Resolve & Clear
                    </button>
                    <button
                      onClick={() => handleDeleteClick(tap.id)}
                      className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-150 hover:bg-red-100/70 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div
            className="w-full max-w-xl rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto bg-white border border-slate-200 shadow-2xl"
          >
            <button
              onClick={() => setEditingTap(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg transition-colors"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-slate-800 mb-4">Edit Water Tap Kiosk</h3>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider">Kiosk Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-slate-850 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider">Street Address</label>
                <input
                  type="text"
                  required
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-slate-850 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={editLat}
                    onChange={(e) => setEditLat(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-slate-850 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={editLng}
                    onChange={(e) => setEditLng(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-slate-850 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider">Operational Hours</label>
                  <input
                    type="text"
                    value={editHours}
                    onChange={(e) => setEditHours(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-slate-850 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider">Water Safety Status</label>
                  <select
                    value={editWaterQuality}
                    onChange={(e) => setEditWaterQuality(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-slate-800 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="safe">Safe / Potable</option>
                    <option value="unsafe">Needs Boiling / Filtering</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Free to use Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-bold text-slate-800">Free to Use</p>
                    <p className="text-[10px] text-slate-500">Public/community tap</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={editIsFree}
                    onChange={(e) => setEditIsFree(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Payment selection panel, only visible if not free */}
              {!editIsFree && (
                <div className="p-3.5 rounded-xl space-y-2.5 bg-slate-50 border border-slate-200">
                  <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Payment Options</label>
                  <div className="flex gap-4">
                    {['Coin', 'UPI'].map(method => (
                      <label key={method} className="flex items-center gap-2 text-slate-700 font-bold cursor-pointer select-none">
                        <input
                           type="checkbox"
                           checked={editPaymentMethods.includes(method)}
                           onChange={() => handlePaymentCheckbox(method)}
                           className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600 focus:ring-blue-500"
                        />
                        {method}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-slate-850 bg-slate-50 border border-slate-200 focus:outline-none min-h-[60px]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTap(null)}
                  className="flex-1 py-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-all"
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
