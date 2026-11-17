import { Filter } from 'lucide-react';

interface FilterPanelProps {
  attendees: number;
  equipment: string[];
  allEquipment: string[];
  onAttendees: (n: number) => void;
  onToggleItem: (item: string) => void;
}

// The filter controls only: it shows the criteria and reports changes. No filtering here.
export default function FilterPanel({ attendees, equipment, allEquipment, onAttendees, onToggleItem }: FilterPanelProps) {
  return (
    <div>
      <h2 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
        <Filter size={18} className="text-emerald-600" /> Find a room
      </h2>
      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="attendees">
        Attendees
      </label>
      <input
        id="attendees"
        type="number"
        min={1}
        value={attendees}
        onChange={(e) => onAttendees(Math.max(1, Number(e.target.value) || 1))}
        className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <p className="block text-sm font-medium text-slate-700 mt-3 mb-1">Required equipment (all of)</p>
      <div className="flex flex-wrap gap-2">
        {allEquipment.map((item) => {
          const on = equipment.includes(item);
          return (
            <label
              key={item}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm cursor-pointer ${
                on ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-300 text-slate-600'
              }`}
            >
              <input type="checkbox" checked={on} onChange={() => onToggleItem(item)} className="accent-emerald-600" />
              {item}
            </label>
          );
        })}
      </div>
    </div>
  );
}
