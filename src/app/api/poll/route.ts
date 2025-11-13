// import { addPoll, getPoll } from '@/firebase/firebaseConfig';
import { addPoll } from '@/firebase/firebaseConfig';
import { NextRequest, NextResponse } from 'next/server';

// export async function GET(request: NextRequest) {
//   const fetchedReplays = await getPoll();
//   const response = {
//     message: '성공',
//     data: fetchedReplays,
//     status: 201,
//   };
//   return NextResponse.json(response, { status: 201 });
// }

export async function POST(request: NextRequest) {
  const { categories, title, desc, type } = await request.json();
  let response = {};
  if (type == 'create') {
    const addedPoll = await addPoll({
      categories,
      desc,
      title,
    });
    response = {
      message: '투표생성됨',
      data: addedPoll,
    };
  } else {
    // const response = {
    //   message: '무라사키',
    //   data: editedPoll,
    // };
  }
  return Response.json(response, { status: 200 });
}
