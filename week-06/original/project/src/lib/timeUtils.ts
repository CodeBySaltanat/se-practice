export type Minutes = number;

export const MINUTES_PER_DAY = 1440;

export function minutesToLabel(min: Minutes): string {
  const m = ((min % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h24 = Math.floor(m / 60);
  const mm = m % 60;
  const period = h24 < 12 ? 'AM' : 'PM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${mm.toString().padStart(2, '0')} ${period}`;
}

export function rangeLabel(start: Minutes, end: Minutes): string {
  return `${minutesToLabel(start)} – ${minutesToLabel(end)}`;
}

export function nowInMinutes(date = new Date()): Minutes {
  return date.getHours() * 60 + date.getMinutes();
}

export function durationLabel(mins: Minutes): string {
  if (mins <= 0) return '0 min';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}
