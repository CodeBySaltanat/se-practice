import { useState } from 'react';
import { Building2, Clock, CalendarClock, CheckCircle2, XCircle, Users, Ban, SearchX } from 'lucide-react';
import { ROOMS, EQUIPMENT } from '@/rooms';
import { filterRooms } from '@/filter';
import { checkRoom, unavailableReasons } from '@/booking';
import { rangeLabel, durationLabel, parseTimeInput, toTimeInput } from '@/lib/timeUtils';
import FilterPanel from './FilterPanel';
import Timeline from './Timeline';

// The fixed "current time" of the demo (09:00), so every result can be repeated. It can be changed on the page.
const DEMO_NOW = 9 * 60;

export default function RoomChecker() {
  const [attendees, setAttendees] = useState(1);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [roomId, setRoomId] = useState<string | null>(ROOMS[0].id);
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [nowMin, setNowMin] = useState<number>(DEMO_NOW);

  const shown = filterRooms(ROOMS, { attendees, equipment });
  // F5: only a room that is still in the filtered list counts as selected.
  const room = shown.find((r) => r.id === roomId) ?? null;
  const start = parseTimeInput(startStr);
  const end = parseTimeInput(endStr);
  const request = start !== null && end !== null ? { start, end, now: nowMin } : null;

  // Derived on every render, never stored: changing the room or the times refreshes it (F5).
  const available = room && request ? checkRoom(ROOMS, room.id, request) : null;
  const reasons = room && request && available === false ? unavailableReasons(room, request) : [];
  const duration = request ? request.end - request.start : 0;

  const toggleItem = (item: string) =>
    setEquipment((list) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]));

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-600 text-white shrink-0">
            <CalendarClock size={22} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Smart Campus Room Availability</h1>
            <p className="text-sm text-slate-500">Find a room that fits, then check whether it is free for your time slot.</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
          <FilterPanel
            attendees={attendees}
            equipment={equipment}
            allEquipment={EQUIPMENT}
            onAttendees={setAttendees}
            onToggleItem={toggleItem}
          />

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Building2 size={18} className="text-emerald-600" /> Rooms ({shown.length})
            </h2>
            {shown.length === 0 ? (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
                <SearchX size={18} className="shrink-0 mt-0.5" />
                <span>No rooms match these requirements. Lower the number of attendees or select less equipment.</span>
              </div>
            ) : (
              <ul className="space-y-2">
                {shown.map((r) => (
                  <li key={r.id}>
                    <button
                      onClick={() => setRoomId(r.id)}
                      className={`w-full text-left rounded-lg border px-3 py-2 text-sm ${
                        r.id === room?.id ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-medium text-slate-800">{r.name}</span>
                      {r.blocked && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-red-600">
                          <Ban size={12} /> Blocked
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <Users size={12} /> {r.capacity} · {r.equipment.join(', ')}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="start">Start</label>
              <input id="start" type="time" value={toTimeInput(start)} onChange={(e) => setStartStr(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="end">End</label>
              <input id="end" type="time" value={toTimeInput(end)} onChange={(e) => setEndStr(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <label className="block text-xs font-medium text-slate-500 mb-1" htmlFor="now">Current time (fixed for the demo)</label>
            <input id="now" type="time" value={toTimeInput(nowMin)}
              onChange={(e) => setNowMin(parseTimeInput(e.target.value) ?? nowMin)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </section>

        <section className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm p-5" aria-live="polite">
          {!room ? (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-500">
              {shown.length === 0 ? 'No room to check: change the filters first.' : 'Select a room from the list to check it.'}
            </div>
          ) : (
            <>
              <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-emerald-600" /> Availability for {room.name}
              </h2>
              <Timeline room={room} candidateStart={start} candidateEnd={end} />

              {available === null ? (
                <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-500">
                  Select a start and end time to see the availability decision.
                </div>
              ) : available ? (
                <div className="mt-4 flex items-start gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="text-emerald-600 mt-0.5 shrink-0" size={22} />
                  <div>
                    <p className="font-semibold text-emerald-800">Available</p>
                    <p className="text-sm text-emerald-700">
                      {room.name} is free for {rangeLabel(request!.start, request!.end)} ({durationLabel(duration)}).
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                  <XCircle className="text-red-600 mt-0.5 shrink-0" size={22} />
                  <div>
                    <p className="font-semibold text-red-800">Unavailable</p>
                    <ul className="list-disc list-inside text-sm text-red-700 mt-1 space-y-0.5">
                      {reasons.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="mt-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Existing bookings of {room.name}</h3>
                {room.bookings.length === 0 ? (
                  <p className="text-sm text-slate-400">No existing bookings.</p>
                ) : (
                  <ul className="space-y-2">
                    {room.bookings.map((b) => (
                      <li key={`${b.start}-${b.end}`} className="text-sm border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700">
                        {rangeLabel(b.start, b.end)}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 text-xs text-slate-400">Checking availability does not change these bookings.</p>
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="max-w-5xl mx-auto px-4 sm:px-6 pb-8 text-center text-xs text-slate-400">
        Fictional rooms and bookings · one day, 00:00–24:00
      </footer>
    </div>
  );
}
