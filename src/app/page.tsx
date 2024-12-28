'use client'

import { useEffect, useRef, useState } from 'react'
import { storage } from '../firebase/firebaseConfig'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useRouter } from 'next/navigation'
import { IoIosClose } from 'react-icons/io'
import Menu from '@/component/menu'
import Spinner from '@/component/spinner'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState({
    x: -1,
    y: -1,
  })
  const [modSwitch, setModSwitch] = useState(-1)
  const [isOpened, setIsOpened] = useState(false)
  const [datas, setDatas] = useState<any>([])
  // const [originTitle, setOriginTitle] = useState('')
  // const [tempTitle, setTempTitle] = useState('')
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

  const addTXT = async () => {
    try {
      let file: any = document.createElement('input')
      file.type = 'file'
      file.addEventListener('change', async () => {
        if (file.files[0].type !== 'text/plain') {
          alert('txt 파일만 올릴 수 있습니다')
          return
        }
        const fileName = file.files[0].name
        const fileRef = ref(storage, `texts/${fileName}.txt`)
        await uploadBytes(fileRef, file.files[0]).then(async (snapshot) => {
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
            semi.unshift(final.data)
            setDatas(semi)
            setLocation({
              x: -1,
              y: -1,
            })
          })
        })
      })
      file.click()
    } catch (e) {}
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
        semi.unshift(final.data)
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
    const sorted = texts.data
      .sort((x: any, y: any) => x.order - y.order)
      .reverse()
    setDatas(sorted)
    setLoading(false)
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
    <div
      className="relative bg-black text-white flex flex-col items-center justify-start h-screen"
      onContextMenu={(e) => {
        e.preventDefault()
        setLocation({
          x: e.pageX,
          y: e.pageY,
        })
      }}
      onClick={() => {
        setLocation({
          x: -1,
          y: -1,
        })
        setModSwitch(-1)
      }}
    >
      {location.x !== -1 && (
        <Menu location={location} customFunctions={{ addText: addTXT }} />
      )}
      {isOpened ? (
        <div>
          {loading ? (
            <div className="w-full h-screen flex justify-center items-center text-white">
              <Spinner />
            </div>
          ) : (
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
                    className="z-40 flex flex-col items-center w-[140px] h-[240px] cursor-pointer"
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
                        <div className="text-overflow w-full text-center">
                          {data.realTitle}
                        </div>
                      </div>
                    </div>
                    <div
                      onContextMenu={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        setModSwitch(idx)
                        // setOriginTitle(datas[idx].realTitle)
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
                              // setTempTitle(e.target.value)
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
          )}
        </div>
      ) : (
        <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
          <div className="flex flex-col justify-center items-center text-7xl font-lobster select-none">
            <div>Semi</div>
            <div>Authorism</div>
          </div>
          <div className="flex flex-col justify-center items-center">
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
          </div>
        </div>
      )}
    </div>
  )
}
