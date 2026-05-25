import { getAdminToken, getTestUserEmail } from './auth';
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
  return parseJson<{ token: string; token_type: string; expires_in: string }>(res);
}

export async function getPricingSettings() {
  const res = await fetch(`${API_BASE}/admin/settings/pricing`, {
    headers: adminHeaders(),
  });
  return parseJson<{ pricePerLink: number; currency: string }>(res);
}

export async function setPricingSettings(price_per_link: number) {
  const res = await fetch(`${API_BASE}/admin/settings/pricing`, {
    method: 'PATCH',
    headers: adminHeaders(),
    body: JSON.stringify({ price_per_link }),
  });
  return parseJson<{ pricePerLink: number; currency: string }>(res);
}

export async function listPromotions() {
  const res = await fetch(`${API_BASE}/admin/promotions`, { headers: adminHeaders() });
  return parseJson<{ promotions: import('./types').Promotion[] }>(res);
}

export async function createPromotion(data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/admin/promotions`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(data),
  });
  return parseJson<{ promotion: import('./types').Promotion }>(res);
}

export async function updatePromotion(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/admin/promotions/${id}`, {
    method: 'PATCH',
    headers: adminHeaders(),
    body: JSON.stringify(data),
  });
  return parseJson<{ promotion: import('./types').Promotion }>(res);
}

export async function deletePromotion(id: string) {
  const res = await fetch(`${API_BASE}/admin/promotions/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
  return parseJson<{ ok: boolean }>(res);
}

export async function listVouchers() {
  const res = await fetch(`${API_BASE}/admin/vouchers`, { headers: adminHeaders() });
  return parseJson<{ vouchers: import('./types').Voucher[] }>(res);
}

export async function createVoucher(data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/admin/vouchers`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(data),
  });
  return parseJson<{ voucher: import('./types').Voucher }>(res);
}

export async function updateVoucher(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/admin/vouchers/${id}`, {
    method: 'PATCH',
    headers: adminHeaders(),
    body: JSON.stringify(data),
  });
  return parseJson<{ voucher: import('./types').Voucher }>(res);
}

export async function deleteVoucher(id: string) {
  const res = await fetch(`${API_BASE}/admin/vouchers/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
  return parseJson<{ ok: boolean }>(res);
}

export async function markOrderPaidAdmin(orderId: string) {
  const res = await fetch(`${API_BASE}/admin/orders/${orderId}/mark-paid`, {
    method: 'POST',
    headers: adminHeaders(),
  });
  return parseJson<{ ok: boolean; order_id: string; status: string }>(res);
}

export async function listStalePool() {
  const res = await fetch(`${API_BASE}/admin/pool/stale`, { headers: adminHeaders() });
  return parseJson<{ stale: unknown[] }>(res);
}
