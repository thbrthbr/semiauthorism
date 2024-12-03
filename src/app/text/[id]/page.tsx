'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ref, uploadString } from 'firebase/storage'
import { storage } from '@/firebase/firebaseConfig'

export default function Text() {
  const router = useRouter()
  const param = useParams()
  const [content, setContent] = useState('')
  const [path, setPath] = useState('')

  const getContent = async () => {
    if (param) {
      const result = await fetch(`http://localhost:3000/api/text/${param.id}`, {
        method: 'GET',
        cache: 'no-store',
      })
      const final = await result.json()
      const path = final.data[0].path
      const response = await fetch(path)
      const textContent = await response.text()
      setPath(final.data[0].title)
      setContent(textContent)
    }
  }

  const editTXT = async () => {
    const fileRef = ref(storage, `texts/${path}.txt`)
    await uploadString(fileRef, content, 'raw', {
      contentType: 'text/plain;charset=utf-8',
    })
    alert('저장되었습니다')
  }

  const goBack = () => {
    router.push('/')
  }

  useEffect(() => {
    getContent()
  }, [])

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="w-full flex justify-center gap-16">
        <button onClick={goBack}>뒤로가기</button>
        <button onClick={editTXT}>저장</button>
      </div>
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
        }}
        className="h-screen outline-none bg-black m-4"
      ></textarea>
    </div>
  )
}
