import { useApp } from '../context/AppContext';
import { Trophy, Award, Star, Flame, User, Droplet } from 'lucide-react';
import { useState } from 'react';

export default function LeaderboardPage() {
  const { user, taps } = useApp();
  const [sortBy, setSortBy] = useState('impact'); // 'impact' or 'taps'

  // Generate leaderboard data
  const getLeaderboard = () => {
    const usersMap = {};
    taps.forEach(tap => {
      const uid = tap.addedBy?.uid || 'anon';
      // Exclude bot/import accounts from leaderboard
      if (uid === 'google-maps-import' || uid === 'anon') return;
      const name = tap.addedBy?.name || 'Anonymous';
      const photoURL = tap.addedBy?.photoURL || '';

      if (!usersMap[uid]) {
        usersMap[uid] = {
          uid,
          name,
          photoURL,
          tapsCount: 0,
          verifiedCount: 0,
          impact: 0,
        };
      }
      usersMap[uid].tapsCount += 1;
      if (tap.isVerified) {
        usersMap[uid].verifiedCount += 1;
      }
      usersMap[uid].impact += (tap.confirmations || 0);
    });

    return Object.values(usersMap).sort((a, b) => {
      if (sortBy === 'impact') {
        if (b.impact !== a.impact) return b.impact - a.impact;
        return b.tapsCount - a.tapsCount;
      } else {
        if (b.tapsCount !== a.tapsCount) return b.tapsCount - a.tapsCount;
        return b.impact - a.impact;
      }
    });
  };

  const list = getLeaderboard();
  const maxVal = Math.max(...list.map(item => sortBy === 'impact' ? item.impact : item.tapsCount), 1);

  return (
    <div className="page-enter flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: '#F1F5F9' }}>
      {/* Header */}
      <div className="px-6 pt-10 pb-6 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
        <div className="max-w-3xl mx-auto w-full flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10 shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Community Leaderboard</h1>
            <p className="text-xs text-white/80">Recognizing Bengaluru's water heroes</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-5 max-w-3xl mx-auto w-full space-y-4">
        {/* Toggle Sorting */}
        <div className="flex p-1 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <button
            onClick={() => setSortBy('impact')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              sortBy === 'impact' ? 'text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
            }`}
            style={sortBy === 'impact' ? { background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' } : {}}
          >
            <Flame className="w-3.5 h-3.5" />
            Sort by Impact
          </button>
          <button
            onClick={() => setSortBy('taps')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              sortBy === 'taps' ? 'text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
            }`}
            style={sortBy === 'taps' ? { background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' } : {}}
          >
            <Droplet className="w-3.5 h-3.5" />
            Sort by Taps Added
          </button>
        </div>

        {/* Leaderboard List */}
        <div className="rounded-3xl overflow-hidden divide-y divide-slate-100 bg-white border border-slate-200 shadow-sm">
          {list.map((item, index) => {
            const isCurrentUser = user && item.uid === user.uid;
            const rankVal = index + 1;
            const isTop3 = rankVal <= 3;
            const score = sortBy === 'impact' ? item.impact : item.tapsCount;
            const progressPct = (score / maxVal) * 100;

            let rankBadge = <span className="text-slate-400 font-bold">{rankVal}</span>;
            if (rankVal === 1) rankBadge = <span className="text-2xl">🥇</span>;
            if (rankVal === 2) rankBadge = <span className="text-2xl">🥈</span>;
            if (rankVal === 3) rankBadge = <span className="text-2xl">🥉</span>;

            return (
              <div
                key={item.uid}
                className={`flex flex-col p-4 transition-all relative ${
                  isCurrentUser ? 'bg-blue-50/30' : ''
                }`}
              >
                {/* Main Row */}
                <div className="flex items-center justify-between gap-3 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 flex items-center justify-center">{rankBadge}</div>
                    
                    {/* User Avatar */}
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-50 flex items-center justify-center">
                      {item.photoURL ? (
                        <img src={item.photoURL} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    <div>
                      <h4 className={`text-sm font-bold ${isCurrentUser ? 'text-blue-600' : 'text-slate-800'}`}>
                        {item.name} {isCurrentUser && <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full ml-1 font-semibold">YOU</span>}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {item.tapsCount} tap{item.tapsCount !== 1 ? 's' : ''} added • {item.verifiedCount} verified
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-slate-800">{score}</span>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                      {sortBy === 'impact' ? 'Impact' : 'Taps'}
                    </span>
                  </div>
                </div>

                {/* Progress bar representing share of contributions */}
                <div className="w-full h-1 mt-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPct}%`,
                      background: isTop3 ? 'linear-gradient(90deg, #2563EB, #60A5FA)' : '#CBD5E1',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
