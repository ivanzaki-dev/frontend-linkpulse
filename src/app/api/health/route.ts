import { NextResponse } from 'next/server';

/** Liveness for Docker HEALTHCHECK and Coolify health path. */
export async function GET() {
  return NextResponse.json(
    { status: 'ok', service: 'linkpulse-frontend' },
    { status: 200 }
  );
}
