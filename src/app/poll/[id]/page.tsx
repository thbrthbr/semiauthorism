'use client'

import { useEffect, useRef, useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useParams, useRouter } from 'next/navigation'
import Spinner from '@/component/spinner'
import Poll from '../../../component/poll'
import Polls from '@/component/polls'

export default function Home() {
  const router = useRouter()
  const param = useParams()
  const [poll, setPoll] = useState<any>(null)
  const [showPolls, setShowPolls] = useState<boolean>(false)
  const [polls, setPolls] = useState<any>([])
  const [pod, setPod] = useState<any>(null)

  const getPoll = async () => {
    const result = await fetch(`/api/poll/${param.id}`, {
      method: 'GET',
      cache: 'no-store',
    })
    const final = await result.json()
    const obj = final.data[0]
    obj.categories = JSON.parse(obj.categories)
    setPoll(obj)
    const res = await fetch(`/api/main`, {
      method: 'GET',
      cache: 'no-store',
    })
    const final2 = await res.json()
    setPolls(
      final2.data.polls.map((item: any, i: number) => {
        return { ...item, categories: JSON.parse(item.categories) }
      }),
    )
    setPod({ id: obj.id })
  }

  useEffect(() => {
    getPoll()
  }, [])
  return (
    <div className="w-full relative text-white flex flex-col items-center justify-start">
      {poll ? <Poll data={poll} /> : <Spinner />}
      <button
        onClick={() => {
          setShowPolls(!showPolls)
        }}
        className="w-72 px-4 py-2 bg-white text-black font-semibold rounded-lg shadow-md
                          hover:bg-gray-200 active:scale-95 transition-transform duration-150 ease-out"
      >
        {showPolls ? '접기' : '다른 투표들 보기'}
      </button>
      {showPolls && <Polls datas={polls} pod={pod} />}
    </div>
  )
}
