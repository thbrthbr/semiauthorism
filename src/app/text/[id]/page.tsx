'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useCallback } from 'react'
import { ref, uploadString } from 'firebase/storage'
import { storage } from '@/firebase/firebaseConfig'
import { FaArrowLeft, FaArrowDown, FaRegSave } from 'react-icons/fa'
import Spinner from '@/component/spinner'
import { LuDownload } from 'react-icons/lu'

export default function Text() {
  const router = useRouter()
  const param = useParams()
  const belowRef = useRef<any>(null)
  const contentRef = useRef('') // content 상태를 저장하기 위한 useRef
  const [content, setContent] = useState('')
  const [path, setPath] = useState('')
  const [loading, setLoading] = useState(true)
  const [txtTitle, setTxtTitle] = useState('')

  const getContent = async () => {
    if (param) {
      const result = await fetch(`/api/text/${param.id}`, {
        method: 'GET',
        cache: 'no-store',
      })
      const final = await result.json()
      const path = final.data[0].path
      const response = await fetch(path)
      const textContent = await response.text()
      setPath(final.data[0].title)
      setContent(textContent)
      setLoading(false)
      setTxtTitle(final.data[0].realTitle)
    }
  }

  const downloadTXT = (e: any) => {
    const willYou = window.confirm('텍스트 파일은 다운로드 하시겠습니까?')
    if (willYou) {
      const blob = new Blob([content], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.download = txtTitle
      a.href = url
      a.click()
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 100)
    }
  }

  useEffect(() => {
    contentRef.current = content
  }, [content])

  const editTXT = useCallback(async () => {
    if (belowRef.current) {
      const fileRef = ref(storage, `texts/${path}.txt`)
      await uploadString(fileRef, contentRef.current, 'raw', {
        contentType: 'text/plain;charset=utf-8',
      })
      alert('저장되었습니다')
    }
  }, [path])

  const handleSaveShortcut = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault()
        editTXT() // 최신 상태가 반영된 editTXT 호출
      }
    },
    [editTXT], // editTXT를 의존성으로 추가
  )

  const handleTabKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault() // 기본 동작 방지 (다음 요소로 포커스 이동)
      const target = event.target as HTMLTextAreaElement
      const start = target.selectionStart
      const end = target.selectionEnd

      // 현재 커서 위치에 Tab 추가
      const newValue =
        content.substring(0, start) + '\t' + content.substring(end)
      setContent(newValue)

      // 커서를 들여쓰기 이후 위치로 이동
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 1
      }, 0)
    }
  }

  useEffect(() => {
    getContent()
    document.addEventListener('keydown', handleSaveShortcut)
    return () => {
      document.removeEventListener('keydown', handleSaveShortcut)
    }
  }, [handleSaveShortcut])

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-white">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="w-full flex justify-center items-center gap-16 px-1 py-3">
        <button onClick={() => router.push('/')}>
          <FaArrowLeft className="text-[#FFFFFF]" />
        </button>
        <button onClick={editTXT}>
          <FaRegSave className="text-[#FFFFFF]" />
        </button>
        <button onClick={downloadTXT}>
          <LuDownload className="text-[#FFFFFF] font-bold" />
        </button>
        <button
          onClick={() =>
            belowRef.current?.scrollTo({ top: belowRef.current.scrollHeight })
          }
        >
          <FaArrowDown className="text-[#FFFFFF]" />
        </button>
      </div>
      <textarea
        ref={belowRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleTabKey} // Tab 키 핸들러 추가
        className="h-screen overflow-y-scroll scrollbar outline-none bg-black m-4 text-white resize-none"
      ></textarea>
    </div>
  )
}
