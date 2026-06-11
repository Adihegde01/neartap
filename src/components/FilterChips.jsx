import { useApp } from '../context/AppContext';

const FILTERS = [
  { id: 'all',        label: 'All'               },
  { id: 'open',       label: 'Open now'          },
  { id: 'verified',   label: 'Verified safe'     },
  { id: 'free',       label: 'Free'              },
];

export default function FilterChips() {
  const { activeFilters, toggleFilter } = useApp();

  return (
    <div
      className="flex gap-2 overflow-x-auto"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {FILTERS.map(({ id, label }) => {
        const active = activeFilters.includes(id);
        return (
          <button
            key={id}
            onClick={() => toggleFilter(id)}
            className={active ? 'chip-on' : 'chip-off'}
            style={{ whiteSpace: 'nowrap' }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
