export type Pricing = {
  price_per_link: number;
  subtotal: number;
  promotion_discount: number;
  voucher_discount: number;
  discount_amount: number;
  total_price: number;
  currency: string;
  voucher_applied: string | null;
  promotion_applied: string | null;
};

export type YoutubeVideoRow = {
  index: number;
  label: string;
  video_id: string;
  youtube_url?: string;
  title?: string;
  shopee_link_count: number;
};

export type PreviewJob = {
  preview_job_id: string;
  status: string;
  message?: string;
  youtube_videos?: YoutubeVideoRow[];
  total_shopee_links?: number;
  pricing?: Pricing;
  error?: { code: string; message: string };
};

export type CreateOrderResponse = {
  order_id: string;
  status: string;
  payment_status: string;
  total_links: number;
  total_price: number;
  youtube_videos: YoutubeVideoRow[];
  pricing: Pricing;
};

export type OrderListItem = {
  id: string;
  status: string;
  payment_status: string;
  total_shopee_links: number;
  total_price: number;
  currency: string;
  report_url: string | null;
  created_at: string;
  completed_at: string | null;
};

export type OrderStatus = {
  order_id: string;
  status: string;
  payment_status: string;
  progress: {
    total_links: number;
    screenshots_done: number;
    screenshots_failed: number;
    analysis_done: number;
    current_step: string;
  };
  results: {
    active_count: number;
    inactive_count: number;
    error_count: number;
    report_url: string | null;
  } | null;
};

export type Promotion = {
  id: string;
  name: string;
  type: 'percent' | 'fixed';
  value: number;
  valid_from: string | null;
  valid_until: string | null;
  active: boolean;
};

export type Voucher = {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  min_links: number | null;
  max_uses: number | null;
  used_count: number;
  valid_from: string | null;
  valid_until: string | null;
  active: boolean;
};

export type VoucherInput = {
  code?: string;
  type?: 'percent' | 'fixed';
  value?: number;
  min_links?: number | null;
  max_uses?: number;
  valid_from?: string;
  valid_until?: string;
  active?: boolean;
};

export type VoucherCreateInput = Required<
  Pick<VoucherInput, 'code' | 'type' | 'value' | 'max_uses' | 'valid_from' | 'valid_until'>
> &
  Pick<VoucherInput, 'min_links' | 'active'>;

export type PromotionInput = {
  name?: string;
  type?: 'percent';
  value?: number;
  valid_from?: string;
  valid_until?: string;
  active?: boolean;
};

export type PromotionCreateInput = Required<
  Pick<PromotionInput, 'name' | 'value' | 'valid_from' | 'valid_until'>
> & {
  type: 'percent';
} & Pick<PromotionInput, 'active'>;

export type ApiError = {
  error?: { code?: string; message?: string };
};

export type AdminLoginResponse = {
  token: string;
  token_type: string;
  expires_in: string;
  role: string;
  email?: string;
};

export type StatComparison = {
  value: number;
  previous_value: number;
  change_percent: number;
  change_label: string;
};

export type AdminStatsOverview = {
  revenue: StatComparison;
  links: StatComparison;
  orders: StatComparison;
  period: { current_month: string; previous_month: string };
};

export type StatsSeriesPoint = { month: string; value: number };

export type AdminOrderListItem = {
  id: string;
  invoice_number: string | null;
  status: string;
  payment_status: string;
  total_shopee_links: number;
  total_price: number;
  currency: string;
  created_at: string;
  paid_at: string | null;
  completed_at: string | null;
  created_by_admin: boolean;
  admin_operator_name?: string | null;
  channel_name?: string | null;
  customer: { id: string; email: string | null; name: string | null };
};

export type AdminOrderDetail = {
  order: {
    id: string;
    invoice_number: string | null;
    status: string;
    payment_status: string;
    total_shopee_links: number;
    price_per_link: number;
    subtotal: number;
    discount_amount: number;
    total_price: number;
    currency: string;
    report_url: string | null;
    created_at: string;
    paid_at: string | null;
    completed_at: string | null;
    created_by_admin: boolean;
    admin_operator_name?: string | null;
    channel_name?: string | null;
  };
  customer: { id: string; email: string; name: string | null } | null;
  youtube_videos: YoutubeVideoRow[];
  links_summary: { total: number; active: number; inactive: number; error: number };
  pool: { pool_status: string; claimed_by: string | null } | null;
};

export type AdminPreviewJob = {
  preview_job_id: string;
  status: string;
  error_message?: string | null;
  youtube_urls?: string[];
  result?: unknown;
  customer: { id: string; email: string; name: string | null } | null;
};
