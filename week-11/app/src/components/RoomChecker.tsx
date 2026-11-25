import { useMemo, useState } from 'react';
import { Building2, Clock, CalendarClock, CheckCircle2, XCircle, Users, Ban } from 'lucide-react';
import { rooms, type Room } from '@/lib/roomsData';
import { evaluateAvailability } from '@/lib/validation';
import { minutesToLabel, rangeLabel, nowInMinutes, durationLabel, MINUTES_PER_DAY } from '@/lib/timeUtils';
import Timeline from './Timeline';

function timeInput(value: string): number | null {
  if (!value) return null;
  const [h, m] = value.split(':').map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
}

function toInputValue(min: number | null): string {
  if (min === null) return '';
  const m = ((min % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
}

export default function RoomChecker() {
  const [roomId, setRoomId] = useState<string>(rooms[0].id);
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [nowMin, setNowMin] = useState<number>(nowInMinutes());

  const room: Room = useMemo(() => rooms.find((r) => r.id === roomId)!, [roomId]);
  const start = timeInput(startStr);
  const end = timeInput(endStr);

  const decision = useMemo(
    () => evaluateAvailability(room, start ?? -1, end ?? -1, nowMin),
    [room, start, end, nowMin],
  );

  const showDecision = start !== null && end !== null;
  const duration = start !== null && end !== null ? end - start : 0;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-600 text-white">
            <CalendarClock size={22} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Smart Campus Room Availability</h1>
            <p className="text-sm text-slate-500">Check whether a campus room is free for your requested time slot.</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 grid gap-6 lg:grid-cols-5">
        {/* Form panel */}
        <section className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Building2 size={18} className="text-emerald-600" /> Booking Request
          </h2>

          <label className="block text-sm font-medium text-slate-700 mb-1">Room</label>
          <select
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} — {r.building}
                {r.blocked ? ' (Blocked)' : ''}
              </option>
            ))}
          </select>

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <Users size={14} /> Capacity: {room.capacity}
            {room.blocked && (
              <span className="inline-flex items-center gap-1 text-red-600 font-medium ml-2">
                <Ban size={14} /> {room.blockedReason}
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start</label>
              <input
                type="time"
                value={toInputValue(start)}
                onChange={(e) => setStartStr(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End</label>
              <input
                type="time"
                value={toInputValue(end)}
                onChange={(e) => setEndStr(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {duration > 0 && (
            <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
              <Clock size={14} /> Duration: {durationLabel(duration)}
            </p>
          )}

          <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <label className="block text-xs font-medium text-slate-500 mb-1">Current time baseline</label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={toInputValue(nowMin)}
                onChange={(e) => setNowMin(timeInput(e.target.value) ?? nowMin)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => setNowMin(nowInMinutes())}
                className="text-xs text-emerald-700 hover:underline whitespace-nowrap"
              >
                Use real current time
              </button>
            </div>
          </div>
        </section>

        {/* Result panel */}
        <section className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-emerald-600" /> Availability for {room.name}
          </h2>

          <Timeline
            room={room}
            candidateStart={start}
            candidateEnd={end}
          />

          {/* Decision banner */}
          {showDecision ? (
            decision.status === 'available' ? (
              <div className="mt-4 flex items-start gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="text-emerald-600 mt-0.5 shrink-0" size={22} />
                <div>
                  <p className="font-semibold text-emerald-800">Available</p>
                  <p className="text-sm text-emerald-700">
                    {room.name} is free for {rangeLabel(start!, end!)} ({durationLabel(duration)}).
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                <XCircle className="text-red-600 mt-0.5 shrink-0" size={22} />
                <div>
                  <p className="font-semibold text-red-800">Unavailable</p>
                  <ul className="list-disc list-inside text-sm text-red-700 mt-1 space-y-0.5">
                    {decision.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          ) : (
            <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-500">
              Select a start and end time to see the availability decision.
            </div>
          )}

          {/* Existing bookings list (read-only — AC5) */}
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Existing bookings (today)</h3>
            {room.bookings.length === 0 ? (
              <p className="text-sm text-slate-400">No existing bookings.</p>
            ) : (
              <ul className="space-y-2">
                {room.bookings
                  .slice()
                  .sort((a, b) => a.start - b.start)
                  .map((b) => (
                    <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 text-sm border border-slate-200 rounded-lg px-3 py-2">
                      <span className="font-medium text-slate-700">{rangeLabel(b.start, b.end)}</span>
                      <span className="text-slate-500">{b.purpose} · {b.bookedBy}</span>
                    </li>
                  ))}
              </ul>
            )}
            <p className="mt-2 text-xs text-slate-400">Checking availability does not modify these bookings.</p>
          </div>
        </section>
      </main>

      <footer className="max-w-5xl mx-auto px-4 sm:px-6 pb-8 text-center text-xs text-slate-400">
        Sample data only · Times are in 24-hour format within a single day (00:00–24:00)
      </footer>
    </div>
  );
}
