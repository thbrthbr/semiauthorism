// import {
//   deleteSpecificText,
//   editSpecificTitle,
//   getSpecificText,
// } from '@/firebase/firebaseConfig'
// import { NextRequest, NextResponse } from 'next/server'

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//   const { id } = params
//   const fetchedSearchTexts = await getSpecificText(id)
//   if (fetchedSearchTexts === null) {
//     return new Response(null, { status: 204 })
//   }
//   const response = {
//     message: '성공',
//     data: fetchedSearchTexts,
//   }

//   return NextResponse.json(response, { status: 201 })
// }

// export async function POST(
//   request: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//   if (params.id == 'edit-title') {
//     const { id, newTitle } = await request.json()
//     const res = await editSpecificTitle({ id, newTitle })
//     return NextResponse.json(
//       {
//         message: '성공',
//         data: res,
//       },
//       { status: 201 },
//     )
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//   if (params.id == 'delete') {
//     const { id } = await request.json()
//     const deleteWritten = await deleteSpecificText(id)
//     const response = {
//       message: '성공',
//       data: deleteWritten,
//     }
//     if (deleteWritten === null) return new Response(null, { status: 204 })
//     return NextResponse.json(response, { status: 201 })
//   }
// }

import {
  deleteSpecificText,
  editSpecificTitle,
  getSpecificText,
} from '@/firebase/firebaseConfig'
import { NextRequest, NextResponse } from 'next/server'

// 정의된 타입에 따라 RouteContext를 명확히 정의
interface RouteContext {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = context.params

  try {
    const fetchedSearchTexts = await getSpecificText(id)

    if (!fetchedSearchTexts) {
      return NextResponse.json(
        { message: '데이터를 찾을 수 없습니다.' },
        { status: 404 }, // 404 Not Found
      )
    }

    return NextResponse.json(
      { message: '성공', data: fetchedSearchTexts },
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
  const { id } = context.params

  try {
    const body = await request.json()

    if (id === 'edit-title') {
      const { id: textId, newTitle } = body

      const result = await editSpecificTitle({ id: textId, newTitle })

      return NextResponse.json(
        { message: '제목 수정 성공', data: result },
        { status: 200 }, // 200 OK
      )
    }

    return NextResponse.json(
      { message: '잘못된 요청입니다.' },
      { status: 400 }, // 400 Bad Request
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: '서버 에러가 발생했습니다.', error },
      { status: 500 }, // 500 Internal Server Error
    )
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = context.params

  try {
    if (id === 'delete') {
      const body = await request.json()
      const { id: textId } = body

      const deleteResult = await deleteSpecificText(textId)

      if (!deleteResult) {
        return NextResponse.json(
          { message: '삭제할 데이터를 찾을 수 없습니다.' },
          { status: 404 }, // 404 Not Found
        )
      }

      return NextResponse.json(
        { message: '삭제 성공', data: deleteResult },
        { status: 200 }, // 200 OK
      )
    }

    return NextResponse.json(
      { message: '잘못된 요청입니다.' },
      { status: 400 }, // 400 Bad Request
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: '서버 에러가 발생했습니다.', error },
      { status: 500 }, // 500 Internal Server Error
    )
  }
}
