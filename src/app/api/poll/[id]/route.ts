import { editPoll, getPoll, deletePoll } from '@/firebase/firebaseConfig'
import { NextRequest, NextResponse } from 'next/server'

interface RouteContext {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params
  try {
    const fetchedPoll = await getPoll({ id })

    if (!fetchedPoll) {
      return NextResponse.json(
        { message: '데이터를 찾을 수 없습니다.' },
        { status: 404 }, // 404 Not Found
      )
    }

    return NextResponse.json(
      { message: '성공', data: fetchedPoll },
      { status: 200 }, // 200 OK
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: '서버 에러가 발생했습니다.', error },
      { status: 500 }, // 500 Internal Server Error
    )
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const data = await request.json()
  const { id } = await context.params
  const { title, desc, categories, dup, nick, ngrams, pw, end } = data
  const result = await editPoll({
    id,
    title,
    desc,
    categories,
    dup,
    nick,
    pw,
    end,
    ngrams,
  })
  if (result === null) {
    return new Response(null, { status: 204 })
  }
  const response = {
    message: '투표수정됨',
    data: result,
  }
  return NextResponse.json(response, { status: 201 })
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  // const { id } = context.params;

  try {
    const body = await request.json()
    const { id: textId } = body

    const deleteResult = await deletePoll(textId)

    if (!deleteResult) {
      return NextResponse.json(
        { message: '삭제할 데이터를 찾을 수 없습니다.' },
        { status: 404 }, // 404 Not Found
      )
    }

    return NextResponse.json(
      { message: '투표삭제됨', data: deleteResult },
      { status: 200 }, // 200 OK
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: '서버 에러가 발생했습니다.', error },
      { status: 500 }, // 500 Internal Server Error
    )
  }
}
