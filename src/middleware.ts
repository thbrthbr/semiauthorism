import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const origin = request.headers.get('origin') || '';

  // 화이트리스트 — 필요한 도메인만 추가
  const allowedOrigins = [
    'https://pollism.win',
    'https://www.pollism.win',
    'https://semiauthorism.vercel.app',
  ];

  const response = NextResponse.next();

  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  );

  return response;
}

// API 라우트만 적용
export const config = {
  matcher: '/api/:path*',
};
