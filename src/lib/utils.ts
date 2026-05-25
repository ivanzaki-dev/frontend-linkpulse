export function cn(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(' ');
}

export function fmtIDR(n: number) {
  return `Rp ${(Number(n) || 0).toLocaleString('id-ID')}`;
}

export function truncId(id: string, head = 8, tail = 4) {
  if (!id || id.length <= head + tail + 1) return id;
  return `${id.slice(0, head)}…${id.slice(-tail)}`;
}

export function fmtDateTime(d: string) {
  const dt = new Date(d);
  return (
    dt.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) +
    ' · ' +
    dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  );
}
