/** Public env helpers (safe for client bundle). */

export const showDevLinks =
  process.env.NEXT_PUBLIC_SHOW_DEV_LINKS !== 'false' &&
  process.env.NEXT_PUBLIC_SHOW_DEV_LINKS !== '0';
