import { NextRequest, NextResponse } from 'next/server';

const API_BASE =
  process.env.API_URL?.replace(/\/$/, '') ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://127.0.0.1:3000/v1';

export async function POST(req: NextRequest) {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: { message: 'PAYMENT_WEBHOOK_SECRET not configured' } },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const checkout_intent_id = body.checkout_intent_id as string | undefined;
  const order_id = body.order_id as string | undefined;
  if (!checkout_intent_id && !order_id) {
    return NextResponse.json(
      { error: { message: 'checkout_intent_id or order_id required' } },
      { status: 400 }
    );
  }

  const res = await fetch(`${API_BASE}/webhooks/payment-placeholder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Secret': secret,
    },
    body: JSON.stringify({
      checkout_intent_id,
      order_id,
      payment_ref: body.payment_ref || `sim-${Date.now()}`,
    }),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
