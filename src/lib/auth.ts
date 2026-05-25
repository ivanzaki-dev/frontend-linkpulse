const CUSTOMER_EMAIL_KEY = 'linkpulse_test_user_email';
const ADMIN_TOKEN_KEY = 'linkpulse_admin_token';

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
}
