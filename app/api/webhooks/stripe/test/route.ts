import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Webhook endpoint is accessible',
    timestamp: new Date().toISOString(),
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  
  return NextResponse.json({
    success: true,
    message: 'Webhook POST endpoint is accessible',
    timestamp: new Date().toISOString(),
    url: request.url,
    bodyLength: body.length,
    headers: Object.fromEntries(request.headers.entries()),
  });
} 