'use client'

import { useEffect, useRef, useState } from 'react'
import { storage } from '../firebase/firebaseConfig'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useRouter } from 'next/navigation'
import { IoIosClose } from 'react-icons/io'

export default function Home() {
  const [modSwitch, setModSwitch] = useState(-1)
  const [isOpened, setIsOpened] = useState(false)
  const [datas, setDatas] = useState<any>([])
  const [originTitle, setOriginTitle] = useState('')
  const [tempTitle, setTempTitle] = useState('')
  const pwRef = useRef<any>(null)
  const router = useRouter()

  const insertPW = () => {
    if (pwRef.current) {
      if (pwRef.current.value == process.env.NEXT_PUBLIC_PW) {
        const expirationTime = Date.now() + 24 * 60 * 60 * 1000
        const data = { value: true, expiresAt: expirationTime }
        localStorage.setItem('semiauthorism', JSON.stringify(data))
        setIsOpened(true)
      } else {
        pwRef.current.value = ''
      }
    }
  }

  const openForAWhile = () => {
    const item = localStorage.getItem('semiauthorism')
    if (item) {
      const parsed = JSON.parse(item)
      const currentTime = Date.now()
      if (parsed.expiresAt > currentTime) {
        setIsOpened(parsed.value)
      } else {
        localStorage.removeItem('semiauthorism')
      }
    }
  }

  const makeTXTfile = () => {
    return new Blob([''], { type: 'text/plain;charset=utf-8' })
  }

  const addWritten = async () => {
    const file = makeTXTfile()
    const fileName = `untitled${Date.now()}`
    const fileRef = ref(storage, `texts/${fileName}.txt`)
    await uploadBytes(fileRef, file).then(async (snapshot) => {
      getDownloadURL(snapshot.ref).then(async (downUrl) => {
        const brought = await fetch(
          `${process.env.NEXT_PUBLIC_SITE}/api/text`,
          {
            method: 'POST',
            body: JSON.stringify({
              title: fileName,
              path: downUrl,
              order: Date.now(),
              realTitle: fileName,
            }),
            cache: 'no-store',
          },
        )
        const final = await brought.json()
        const semi = datas.slice(0)
        semi.push(final.data)
        setDatas(semi)
      })
    })
  }

  const getWritten = async () => {
    const result = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/text`, {
      method: 'GET',
      cache: 'no-store',
    })
    const texts = await result.json()
    setDatas(texts.data)
  }

  const enterText = (each: string) => {
    router.push(`/text/${each}`)
  }

  const deleteWritten = async (id: string) => {
    const willYou = window.confirm('해당 텍스트를 삭제하시겠습니까')
    if (willYou) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SITE}/api/text/delete`,
        {
          method: 'DELETE',
          body: JSON.stringify({
            id,
          }),
          cache: 'no-store',
        },
      )
      const final = await res.json()
      if (final.message == '삭제 성공') {
        const temp = []
        for (let i = 0; i < datas.length; i++) {
          if (datas[i].id !== id) {
            temp.push(datas[i])
          }
        }
        setDatas(temp)
      }
    }
  }

  const editTitle = async (id: string, newTitle: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/text/edit-title`, {
      method: 'POST',
      body: JSON.stringify({
        id,
        newTitle,
      }),
      cache: 'no-store',
    })
  }

  useEffect(() => {
    openForAWhile()
  }, [])

  useEffect(() => {
    if (isOpened) {
      getWritten()
    }
  }, [isOpened])

  return (
    <div className="flex flex-col items-center justify-center">
      {isOpened ? (
        <div>
          <div className="flex m-8 gap-8 flex-wrap">
            <div
              className="flex flex-col items-center w-[140px]"
              key={0}
              onClick={addWritten}
            >
              <div className="rounded-md bg-white w-[140px] h-[200px]">
                <div className="ml-4 mr-4 h-full flex justify-center items-center text-black text-center cursor-pointer">
                  +
                </div>
              </div>
            </div>
            {datas.map((data: any, idx: number) => {
              return (
                <div
                  className="flex flex-col items-center w-[140px] h-[240px] cursor-pointer"
                  key={idx + 1}
                  onClick={() => {
                    enterText(data.id)
                  }}
                >
                  <div className="relative rounded-md bg-white w-[140px] h-[200px] mh-[200px]">
                    <div
                      className="absolute text-black p-1 end-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteWritten(data.id)
                      }}
                    >
                      <IoIosClose />
                    </div>
                    <div className="ml-4 mr-4 h-full flex justify-start items-center text-black">
                      <div className="text-overflow">{data.realTitle}</div>
                    </div>
                  </div>
                  <div
                    onContextMenu={(e) => {
                      e.preventDefault()
                      setModSwitch(idx)
                      setOriginTitle(datas[idx].realTitle)
                    }}
                  >
                    {modSwitch == idx ? (
                      <div>
                        <input
                          className="text-black"
                          value={data.realTitle}
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                          onChange={(e) => {
                            let temp = datas.slice(0)
                            temp[idx].realTitle = e.target.value
                            setTempTitle(e.target.value)
                            setDatas(temp)
                          }}
                          onKeyDown={(e) => {
                            if (e.key == 'Enter') {
                              setModSwitch(-1)
                              editTitle(data.id, datas[idx].realTitle)
                            }
                          }}
                        ></input>
                      </div>
                    ) : (
                      <div className="text-overflow-2">{data.realTitle}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <>
          <div>비밀번호를 입력하세요</div>
          <input
            type="password"
            className="text-black"
            onKeyDown={(e) => {
              if (e.key == 'Enter') {
                insertPW()
              }
            }}
            ref={pwRef}
          ></input>
        </>
      )}
    </div>
  )
}
