import { checkPW } from '@/firebase/firebaseConfig';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { pw, id, type } = await request.json();
  let response = {};
  if (type === 'admin') {
    if (pw == 'hengbengquatrobe') {
      response = {
        message: 'OK',
      };
    } else {
      response = {
        message: 'NO',
      };
    }
  } else if (type === 'user') {
    const res = await checkPW({ id, pw });
    response = {
      message: res,
    };
  }
  return Response.json(response, { status: 200 });
}
