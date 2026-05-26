const MIN_ACTIVE_MS = 5 * 60 * 1000;

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/** Value for `<input type="datetime-local" />` in local timezone. */
export function toDatetimeLocalValue(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function toIsoFromDatetimeLocal(value: string): string {
  return new Date(value).toISOString();
}

export function fromIsoToDatetimeLocal(iso: string): string {
  return toDatetimeLocalValue(new Date(iso));
}

export function defaultValidityWindow() {
  const from = new Date();
  const until = new Date(from.getTime() + 7 * 24 * 60 * 60 * 1000);
  return {
    valid_from: toDatetimeLocalValue(from),
    valid_until: toDatetimeLocalValue(until),
  };
}

export function assertMinActiveMinutes(
  validFromLocal: string,
  validUntilLocal: string,
  minutes = 5,
): void {
  const from = new Date(validFromLocal);
  const until = new Date(validUntilLocal);
  const minMs = minutes * 60 * 1000;
  const now = Date.now();

  if (until.getTime() < now + minMs) {
    throw new Error('Tanggal berakhir harus minimal 5 menit dari sekarang');
  }
  if (until.getTime() <= from.getTime() + minMs) {
    throw new Error('Periode berlaku minimal 5 menit (tanggal berakhir harus setelah tanggal mulai)');
  }
}

export function formatValidityRange(
  from: string | null,
  until: string | null,
): string {
  const fmt = (s: string) =>
    new Date(s).toLocaleString('id-ID', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  if (from && until) return `${fmt(from)} – ${fmt(until)}`;
  if (from) return `dari ${fmt(from)}`;
  if (until) return `sampai ${fmt(until)}`;
  return '—';
}
