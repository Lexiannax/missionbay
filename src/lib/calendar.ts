// Helpers for events: parsing friendly times like "2:30 PM" and building calendar (.ics) files.
const TZ = 'America/Los_Angeles';

/** "2:30 PM", "14:30", "2pm" → { h, m } in 24-hour time, or null if it can't be read. */
export function parseTime(text?: string | null): { h: number; m: number } | null {
  if (!text) return null;
  const match = text.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*([ap])?\.?m?\.?$/i);
  if (!match) return null;
  let h = Number(match[1]);
  const m = Number(match[2] ?? 0);
  const ap = match[3]?.toLowerCase();
  if (ap === 'p' && h < 12) h += 12;
  if (ap === 'a' && h === 12) h = 0;
  return h > 23 || m > 59 ? null : { h, m };
}

/** Today's date in San Leandro as YYYY-MM-DD. */
export const todayKey = () => new Date().toLocaleDateString('en-CA', { timeZone: TZ });

/** The calendar day of an event date (dates are stored as plain days, read as UTC midnight). */
export const dayKey = (d: Date) => d.toISOString().slice(0, 10);

function offsetMinutes(utcMs: number): number {
  const part = new Intl.DateTimeFormat('en-US', { timeZone: TZ, timeZoneName: 'longOffset' })
    .formatToParts(new Date(utcMs))
    .find((p) => p.type === 'timeZoneName')?.value;
  const m = part?.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!m) return 0;
  return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]));
}

/** San Leandro local date and time → UTC milliseconds, accounting for daylight saving. */
function localToUtc(key: string, h: number, m: number): number {
  const [y, mo, d] = key.split('-').map(Number);
  const guess = Date.UTC(y, mo - 1, d, h, m);
  let utc = guess - offsetMinutes(guess) * 60000;
  utc = guess - offsetMinutes(utc) * 60000;
  return utc;
}

const stamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const escapeText = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

export interface EventForCalendar {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
}

export function buildIcs(event: EventForCalendar, siteUrl: string): string {
  const key = dayKey(event.date);
  const start = parseTime(event.startTime);
  const end = parseTime(event.endTime);

  let when: string[];
  if (start) {
    const s = localToUtc(key, start.h, start.m);
    let e = end ? localToUtc(key, end.h, end.m) : s + 60 * 60000;
    if (e <= s) e = s + 60 * 60000;
    when = [`DTSTART:${stamp(s)}`, `DTEND:${stamp(e)}`];
  } else {
    const next = new Date(event.date.valueOf() + 864e5).toISOString().slice(0, 10);
    when = [`DTSTART;VALUE=DATE:${key.replace(/-/g, '')}`, `DTEND;VALUE=DATE:${next.replace(/-/g, '')}`];
  }

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mission Bay Community News//Events//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}@missionbaynews.us`,
    `DTSTAMP:${stamp(Date.now())}`,
    ...when,
    `SUMMARY:${escapeText(event.title)}`,
    event.location ? `LOCATION:${escapeText(event.location)}` : '',
    `DESCRIPTION:${escapeText([event.description ?? '', `More at ${siteUrl}/events/`].filter(Boolean).join('\n\n'))}`,
    `URL:${siteUrl}/events/`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ]
    .filter((line, i, all) => line !== '' || i === all.length - 1)
    .join('\r\n');
}
