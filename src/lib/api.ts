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

/** Backend API base — must be the API host (e.g. mo5ub2…), NOT the frontend Coolify URL. */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://127.0.0.1:3000/v1';

/**
 * Warn when NEXT_PUBLIC_API_URL points at the same host as the Next.js app (common Coolify mistake).
 */
export function getApiConfigWarning(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const api = new URL(API_BASE);
    const page = new URL(window.location.href);
    if (api.hostname === page.hostname) {
      return (
        'NEXT_PUBLIC_API_URL mengarah ke host frontend yang sama. ' +
        'Set ke URL backend API (mis. https://mo5ub2s6knxuqchfa3m925ep.app.ivanzaki.online/v1), ' +
        'lalu rebuild image frontend. Halaman admin: /admin/login (bukan /v1/admin/login).'
      );
    }
  } catch {
    return 'NEXT_PUBLIC_API_URL tidak valid.';
  }
  return null;
}

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

export const MAX_YOUTUBE_PER_ORDER = 20;
export const MAX_SHOPEE_LINKS_PER_ORDER = 300;

export async function createCheckoutIntent(body: {
  preview_job_id: string;
  voucher_code?: string;
}) {
  const res = await fetch(`${API_BASE}/checkout`, {
    method: 'POST',
    headers: customerHeaders(),
    body: JSON.stringify(body),
  });
  return parseJson<import('./types').CheckoutIntentResponse>(res);
}

export async function getCheckoutIntent(id: string) {
  const res = await fetch(`${API_BASE}/checkout/${id}`, {
    headers: customerHeaders(),
  });
  return parseJson<import('./types').CheckoutIntentResponse & { preview_job_id?: string }>(
    res
  );
}

/** @deprecated Use createCheckoutIntent */
export async function createOrder(body: {
  preview_job_id: string;
  voucher_code?: string;
}) {
  return createCheckoutIntent(body);
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

export async function getOrderReportData(id: string) {
  const res = await fetch(`${API_BASE}/orders/${id}/report-data`, {
    headers: customerHeaders(),
  });
  return parseJson<import('./types').OrderReportData>(res);
}

/** Server-side pay simulation via Next route */
export async function payCheckoutSimulated(checkoutIntentId: string) {
  const res = await fetch('/api/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checkout_intent_id: checkoutIntentId }),
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

export async function createPromotion(data: import('./types').PromotionCreateInput) {
  const res = await adminFetch(`${API_BASE}/admin/promotions`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return parseJson<{ promotion: import('./types').Promotion }>(res);
}

export async function updatePromotion(
  id: string,
  data: Partial<import('./types').PromotionInput>,
) {
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

export async function createVoucher(data: import('./types').VoucherCreateInput) {
  const res = await adminFetch(`${API_BASE}/admin/vouchers`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return parseJson<{ voucher: import('./types').Voucher }>(res);
}

export async function updateVoucher(
  id: string,
  data: Partial<import('./types').VoucherInput>,
) {
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
  channel_name: string;
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
    channel_name: string | null;
  }>(res);
}

export async function adminGetPreviewJob(id: string) {
  const res = await adminFetch(`${API_BASE}/admin/preview-jobs/${id}`);
  return parseJson<AdminPreviewJob>(res);
}

export async function adminCreateCompOrder(body: {
  preview_job_id: string;
  admin_name: string;
  channel_name: string;
  total_price: number;
}) {
  const res = await adminFetch(`${API_BASE}/admin/orders`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return parseJson<
    import('./types').CreateOrderResponse & {
      invoice_number: string;
      admin_operator_name: string | null;
      channel_name: string | null;
    }
  >(res);
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

export async function getAdminOrderReportData(id: string) {
  const res = await adminFetch(`${API_BASE}/admin/orders/${id}/report-data`);
  return parseJson<import('./types').OrderReportData>(res);
}

export async function adminRequeueOrderLink(linkId: string) {
  const res = await adminFetch(`${API_BASE}/admin/order-links/${linkId}/requeue`, {
    method: 'POST',
  });
  return parseJson<{ ok: boolean; link_id: string; capture_status: string }>(res);
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

