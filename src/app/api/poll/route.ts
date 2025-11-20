import { addPoll, getPoll, editPoll } from '@/firebase/firebaseConfig';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const fetchedPoll = await getPoll();
  const response = {
    message: '성공',
    data: fetchedPoll,
    status: 201,
  };
  return NextResponse.json(response, { status: 201 });
}

export async function POST(request: NextRequest) {
  const { categories, title, desc, type, dup, pw, ngrams, nick } =
    await request.json();
  let response = {};
  if (type == 'create') {
    const addedPoll = await addPoll({
      categories,
      desc,
      title,
      dup,
      pw,
      ngrams,
      nick,
    });
    response = {
      message: '투표생성됨',
      data: addedPoll,
    };
  }

  return Response.json(response, { status: 200 });
}
