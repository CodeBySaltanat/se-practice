import { MINUTES_PER_DAY, minutesToLabel } from '@/lib/timeUtils';
import type { Room } from '@/lib/roomsData';

interface TimelineProps {
  room: Room;
  candidateStart: number | null;
  candidateEnd: number | null;
}

const HOURS = Array.from({ length: 25 }, (_, i) => i * 60); // 0,60,...,1440

export default function Timeline({ room, candidateStart, candidateEnd }: TimelineProps) {
  const pct = (m: number) => `${(m / MINUTES_PER_DAY) * 100}%`;

  const hasCandidate =
    candidateStart !== null && candidateEnd !== null && candidateStart < candidateEnd;

  return (
    <div className="w-full">
      <div className="relative h-16 w-full rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
        {/* Existing bookings */}
        {room.bookings.map((b) => (
          <div
            key={b.id}
            className="absolute top-0 bottom-0 bg-slate-300/80 border-x border-slate-400/60 flex items-center justify-center overflow-hidden"
            style={{ left: pct(b.start), width: pct(b.end - b.start) }}
            title={`${minutesToLabel(b.start)}–${minutesToLabel(b.end)}: ${b.purpose}`}
          >
            <span className="text-[10px] text-slate-700 px-1 truncate">{b.purpose}</span>
          </div>
        ))}

        {/* Candidate interval */}
        {hasCandidate && (
          <div
            className="absolute top-0 bottom-0 border-x-2 border-dashed border-emerald-600 bg-emerald-400/30 flex items-center justify-center overflow-hidden"
            style={{ left: pct(candidateStart!), width: pct(candidateEnd! - candidateStart!) }}
            title="Requested interval"
          >
            <span className="text-[10px] font-medium text-emerald-800 px-1 truncate">Request</span>
          </div>
        )}

        {/* Blocked overlay */}
        {room.blocked && (
          <div className="absolute inset-0 bg-red-500/15 flex items-center justify-center">
            <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">Blocked</span>
          </div>
        )}
      </div>

      {/* Hour scale */}
      <div className="relative h-5 mt-1 text-[10px] text-slate-400">
        {HOURS.filter((h) => h % 240 === 0).map((h) => (
          <div
            key={h}
            className="absolute -translate-x-1/2 whitespace-nowrap"
            style={{ left: pct(h) }}
          >
            {minutesToLabel(h)}
          </div>
        ))}
      </div>
    </div>
  );
}
