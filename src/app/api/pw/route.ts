import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { pw } = await request.json();
  let response = {};
  if (pw == 'hengbengquatrobe') {
    response = {
      message: 'OK',
    };
  } else {
    response = {
      message: 'NO',
    };
  }
  return Response.json(response, { status: 200 });
}
