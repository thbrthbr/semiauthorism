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
  const { id, vote, voter } = await request.json();
  const addedVote = await addVote({
    id,
    vote,
    voter,
  });
  const response = {
    message: '무라사키',
    data: addedVote,
  };
  if (addedVote) {
    return Response.json(response, { status: 200 });
  } else {
    return Response.json(
      {
        message: '이미투표함',
        data: null,
      },
      { status: 200 },
    );
  }
}
