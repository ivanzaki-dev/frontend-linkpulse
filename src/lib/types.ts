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

export type ApiError = {
  error?: { code?: string; message?: string };
};
