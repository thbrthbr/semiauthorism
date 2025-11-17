import { addVote } from '@/firebase/firebaseConfig';
import { NextRequest, NextResponse } from 'next/server';

// export async function GET(request: NextRequest) {
//   const fetchedReplays = await getTexts();
//   const response = {
//     message: '성공',
//     data: fetchedReplays,
//     status: 201,
//   };
//   return NextResponse.json(response, { status: 201 });
// }

export async function POST(request: NextRequest) {
  const { id, vote } = await request.json();
  const addedText = await addVote({
    id,
    vote,
  });
  const response = {
    message: '무라사키',
    data: addedText,
  };
  return Response.json(response, { status: 200 });
}
