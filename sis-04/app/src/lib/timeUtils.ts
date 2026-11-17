// Time helpers for the page: minutes after midnight <-> text. No booking rules here.
export type Minutes = number;

export const MINUTES_PER_DAY = 1440;

// One place that splits minutes into hours and minutes (used to be repeated in RoomChecker).
function split(min: Minutes): { h: number; m: number } {
  const wrapped = ((min % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return { h: Math.floor(wrapped / 60), m: wrapped % 60 };
}

export function minutesToLabel(min: Minutes): string {
  const { h, m } = split(min);
  const period = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}

export function rangeLabel(start: Minutes, end: Minutes): string {
  return `${minutesToLabel(start)} – ${minutesToLabel(end)}`;
}

export function durationLabel(mins: Minutes): string {
  if (mins <= 0) return '0 min';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

// "HH:MM" from an <input type="time"> -> minutes, or null when empty or malformed.
export function parseTimeInput(value: string): Minutes | null {
  if (!value) return null;
  const [h, m] = value.split(':').map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
}

// minutes -> "HH:MM" for an <input type="time">.
export function toTimeInput(min: Minutes | null): string {
  if (min === null) return '';
  const { h, m } = split(min);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}
