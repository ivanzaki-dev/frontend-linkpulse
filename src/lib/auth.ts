const CUSTOMER_EMAIL_KEY = 'linkpulse_test_user_email';
const ADMIN_TOKEN_KEY = 'linkpulse_admin_token';
const ADMIN_EMAIL_KEY = 'linkpulse_admin_email';

export function getTestUserEmail(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(CUSTOMER_EMAIL_KEY) || 'test@linkpulse.local';
}

export function setTestUserEmail(email: string) {
  localStorage.setItem(CUSTOMER_EMAIL_KEY, email.trim());
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string | null) {
  if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
  else localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_EMAIL_KEY);
}

export function getAdminEmail(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_EMAIL_KEY);
}

export function setAdminEmail(email: string | null) {
  if (email) localStorage.setItem(ADMIN_EMAIL_KEY, email);
  else localStorage.removeItem(ADMIN_EMAIL_KEY);
}

/** Decode JWT payload without verification (display only). */
export function emailFromAdminToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1] || ''));
    return typeof payload.email === 'string' ? payload.email : null;
  } catch {
    return null;
  }
}
