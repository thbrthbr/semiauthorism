import { searchPolls } from '@/firebase/firebaseConfig';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { searchOption, type } = await request.json();
  let response = {};
  const addedPoll = await searchPolls({
    searchOption,
    type,
  });
  response = {
    message: '투표생성됨',
    data: addedPoll,
  };

  return Response.json(response, { status: 200 });
}
