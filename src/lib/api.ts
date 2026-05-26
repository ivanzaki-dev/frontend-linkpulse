import { clearAdminToken, getAdminToken, getTestUserEmail } from './auth';
import type {
  AdminLoginResponse,
  AdminOrderDetail,
  AdminOrderListItem,
  AdminPreviewJob,
  AdminStatsOverview,
  StatsSeriesPoint,
} from './types';
import type { ApiError } from './types';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://127.0.0.1:3000/v1';

export class ApiClientError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as T & ApiError;
  if (!res.ok) {
    throw new ApiClientError(
      data.error?.message || res.statusText,
      data.error?.code || 'API_ERROR',
      res.status
    );
  }
  return data;
}

function customerHeaders(): HeadersInit {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  const email = getTestUserEmail();
  if (email) h['X-Test-User-Email'] = email;
  return h;
}

function adminHeaders(): HeadersInit {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getAdminToken();
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function adminFetch(url: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(url, {
    ...init,
    headers: { ...adminHeaders(), ...(init?.headers as Record<string, string>) },
  });
  if (res.status === 401 && typeof window !== 'undefined') {
    clearAdminToken();
    window.location.href = '/admin/login';
  }
  return res;
}

// ——— Customer ———

export async function createPreviewJob(body: {
  youtube_urls: string[];
  labels?: string[];
  voucher_code?: string;
}) {
  const res = await fetch(`${API_BASE}/preview-jobs`, {
    method: 'POST',
    headers: customerHeaders(),
    body: JSON.stringify(body),
  });
  return parseJson<{ preview_job_id: string; status: string; message?: string }>(res);
}

export async function getPreviewJob(id: string) {
  const res = await fetch(`${API_BASE}/preview-jobs/${id}`, {
    headers: customerHeaders(),
  });
  return parseJson<import('./types').PreviewJob>(res);
}

export async function createOrder(body: {
  preview_job_id: string;
  voucher_code?: string;
}) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: customerHeaders(),
    body: JSON.stringify(body),
  });
  return parseJson<import('./types').CreateOrderResponse>(res);
}

export async function listOrders(params?: { limit?: number; offset?: number }) {
  const q = new URLSearchParams();
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.offset) q.set('offset', String(params.offset));
  const res = await fetch(`${API_BASE}/orders?${q}`, {
    headers: customerHeaders(),
  });
  return parseJson<{ orders: import('./types').OrderListItem[] }>(res);
}

export async function getOrderStatus(id: string) {
  const res = await fetch(`${API_BASE}/orders/${id}/status`, {
    headers: customerHeaders(),
  });
  return parseJson<import('./types').OrderStatus>(res);
}

export async function getOrderReport(id: string) {
  const res = await fetch(`${API_BASE}/orders/${id}/report`, {
    headers: customerHeaders(),
  });
  return parseJson<{ report_url: string; download_url?: string }>(res);
}

/** Server-side pay simulation via Next route */
export async function payOrderSimulated(orderId: string) {
  const res = await fetch('/api/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_id: orderId }),
  });
  return parseJson<{ ok: boolean; order_id: string; status: string }>(res);
}

// ——— Admin ———

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return parseJson<AdminLoginResponse>(res);
}

export async function getPricingSettings() {
  const res = await adminFetch(`${API_BASE}/admin/settings/pricing`);
  return parseJson<{ pricePerLink: number; currency: string }>(res);
}

export async function setPricingSettings(price_per_link: number) {
  const res = await adminFetch(`${API_BASE}/admin/settings/pricing`, {
    method: 'PATCH',
    body: JSON.stringify({ price_per_link }),
  });
  return parseJson<{ pricePerLink: number; currency: string }>(res);
}

export async function listPromotions() {
  const res = await adminFetch(`${API_BASE}/admin/promotions`);
  return parseJson<{ promotions: import('./types').Promotion[] }>(res);
}

export async function createPromotion(data: Record<string, unknown>) {
  const res = await adminFetch(`${API_BASE}/admin/promotions`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return parseJson<{ promotion: import('./types').Promotion }>(res);
}

export async function updatePromotion(id: string, data: Record<string, unknown>) {
  const res = await adminFetch(`${API_BASE}/admin/promotions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return parseJson<{ promotion: import('./types').Promotion }>(res);
}

export async function deletePromotion(id: string) {
  const res = await adminFetch(`${API_BASE}/admin/promotions/${id}`, {
    method: 'DELETE',
  });
  return parseJson<{ ok: boolean }>(res);
}

export async function listVouchers() {
  const res = await adminFetch(`${API_BASE}/admin/vouchers`);
  return parseJson<{ vouchers: import('./types').Voucher[] }>(res);
}

export async function createVoucher(data: Record<string, unknown>) {
  const res = await adminFetch(`${API_BASE}/admin/vouchers`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return parseJson<{ voucher: import('./types').Voucher }>(res);
}

export async function updateVoucher(id: string, data: Record<string, unknown>) {
  const res = await adminFetch(`${API_BASE}/admin/vouchers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return parseJson<{ voucher: import('./types').Voucher }>(res);
}

export async function deleteVoucher(id: string) {
  const res = await adminFetch(`${API_BASE}/admin/vouchers/${id}`, {
    method: 'DELETE',
  });
  return parseJson<{ ok: boolean }>(res);
}

export async function adminCreatePreviewJob(body: {
  customer_email: string;
  youtube_urls: string[];
  labels?: string[];
  voucher_code?: string;
}) {
  const res = await adminFetch(`${API_BASE}/admin/preview-jobs`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return parseJson<{
    preview_job_id: string;
    status: string;
    customer: { id: string; email: string; name: string | null };
  }>(res);
}

export async function adminGetPreviewJob(id: string) {
  const res = await adminFetch(`${API_BASE}/admin/preview-jobs/${id}`);
  return parseJson<AdminPreviewJob>(res);
}

export async function adminCreateCompOrder(body: {
  preview_job_id: string;
  customer_email: string;
}) {
  const res = await adminFetch(`${API_BASE}/admin/orders`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return parseJson<import('./types').CreateOrderResponse & { invoice_number: string }>(res);
}

export async function listAdminOrders(params?: {
  limit?: number;
  offset?: number;
  status?: string;
  q?: string;
}) {
  const q = new URLSearchParams();
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.offset) q.set('offset', String(params.offset));
  if (params?.status) q.set('status', params.status);
  if (params?.q) q.set('q', params.q);
  const res = await adminFetch(`${API_BASE}/admin/orders?${q}`);
  return parseJson<{
    orders: AdminOrderListItem[];
    total: number;
    limit: number;
    offset: number;
  }>(res);
}

export async function getAdminOrder(id: string) {
  const res = await adminFetch(`${API_BASE}/admin/orders/${id}`);
  return parseJson<AdminOrderDetail>(res);
}

export async function getAdminOrderReport(id: string) {
  const res = await adminFetch(`${API_BASE}/admin/orders/${id}/report`);
  return parseJson<{ report_url: string; download_url: string | null }>(res);
}

export async function markOrderPaidAdmin(orderId: string) {
  const res = await adminFetch(`${API_BASE}/admin/orders/${orderId}/mark-paid`, {
    method: 'POST',
  });
  return parseJson<{ ok: boolean; order_id: string; status: string; invoice_number?: string }>(
    res
  );
}

export async function getAdminStatsOverview() {
  const res = await adminFetch(`${API_BASE}/admin/stats/overview`);
  return parseJson<AdminStatsOverview>(res);
}

export async function getAdminStatsSeries(metric: 'revenue' | 'links' | 'orders', months = 12) {
  const q = new URLSearchParams({ metric, months: String(months) });
  const res = await adminFetch(`${API_BASE}/admin/stats/series?${q}`);
  return parseJson<{ metric: string; months: number; points: StatsSeriesPoint[] }>(res);
}

export async function seedAdminStats() {
  const res = await adminFetch(`${API_BASE}/admin/dev/seed-stats`, { method: 'POST' });
  return parseJson<{ inserted: number }>(res);
}

export async function clearAdminStats() {
  const res = await adminFetch(`${API_BASE}/admin/dev/seed-stats`, { method: 'DELETE' });
  return parseJson<{ deleted: number }>(res);
}

export async function listStalePool() {
  const res = await adminFetch(`${API_BASE}/admin/pool/stale`);
  return parseJson<{ stale: unknown[] }>(res);
}
