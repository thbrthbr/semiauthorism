'use client'

import { useEffect, useRef, useState } from 'react'
import { storage } from '../../firebase/firebaseConfig'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useRouter } from 'next/navigation'
import { IoIosClose } from 'react-icons/io'
import Menu from '@/component/menu'
import Spinner from '@/component/spinner'
import defaultImg from '../../asset/no-image.png'
import { Reorder } from 'framer-motion'
import { MdOutlineCancel, MdOutlineKeyboardBackspace } from 'react-icons/md'
import { LuPencil } from 'react-icons/lu'
import { FaRegTrashAlt } from 'react-icons/fa'
import { createTaggedNgrams } from '@/func/createNgrams'
import Imag from '@/component/image'
import { FaCheck } from 'react-icons/fa6'
import DatePicker from '@/component/date-picker'

export default function PollCreate() {
  const [items, setItems] = useState<any>([])
  const [protoItems, setProtoItems] = useState<any>([])
  const [locked, setLocked] = useState<boolean>(true)
  const pollNickRef = useRef<any>(null)
  const pollPwRef = useRef<any>(null)
  const pollNameRef = useRef<any>(null)
  const pollDescRef = useRef<any>(null)
  const pollDupRef = useRef<any>(null)
  const pollEndRef = useRef<any>(null)
  const router = useRouter()

  // const auth = async () => {
  //   const prompt = window.prompt('비밀번호를 입력하세요');
  //   const res = await fetch(`api/pw`, {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       pw: prompt,
  //     }),
  //     cache: 'no-store',
  //   });
  //   const final = await res.json();
  //   if (final.message == 'OK') {
  //     setLocked(false);
  //   }
  // };
  // const insertPW = () => {
  //   if (pwRef.current) {
  //     if (pwRef.current.value == process.env.NEXT_PUBLIC_PW) {
  //       const expirationTime = Date.now() + 24 * 60 * 60 * 1000
  //       const data = { value: true, expiresAt: expirationTime }
  //       localStorage.setItem('semiauthorism', JSON.stringify(data))
  //       setIsOpened(true)
  //     } else {
  //       pwRef.current.value = ''
  //     }
  //   }
  // }

  // const openForAWhile = () => {
  //   const item = localStorage.getItem('semiauthorism');
  //   if (item) {
  //     const parsed = JSON.parse(item);
  //     const currentTime = Date.now();
  //     if (parsed.expiresAt > currentTime) {
  //       setLocked(parsed.value);
  //     } else {
  //       localStorage.removeItem('semiauthorism');
  //     }
  //   }
  // };

  // @@@@@@@@@@@@@@@@@@@@@@@@

  const createPoll = async () => {
    if (!pollNickRef.current.value || !pollPwRef.current.value) {
      alert('작성자의 닉네임과 비밀번호를 입력해주세요')
      return
    }
    if (!pollNameRef.current.value || !pollDescRef.current.value) {
      alert('투표의 제목과 설명을 적어주세요')
      return
    }
    if (items.length < 2) {
      alert('투표대상을 최소 2개를 생성해주세요')
      return
    }
    if (!pollEndRef.current.value) {
      alert('투표기간을 정해주세요')
      return
    }
    const item = [...items]
    const send = JSON.stringify(item)
    const res = await fetch(`/api/poll`, {
      method: 'POST',
      body: JSON.stringify({
        pw: pollPwRef.current.value,
        type: 'create',
        title: pollNameRef.current.value,
        desc: pollDescRef.current.value,
        dup: pollDupRef.current.value,
        end: pollEndRef.current.value,
        categories: send,
        nick: pollNickRef.current.value,
        ngrams: createTaggedNgrams({
          nick: pollNickRef.current.value,
          title: pollNameRef.current.value,
          // desc: pollDescRef.current.value,
        }),
      }),
      cache: 'no-store',
    })

    const final = await res.json()
    if (final.message == '투표생성됨') {
      alert('투표가 생성되었습니다')
      router.push(`/poll/${final.data.publicId}`)
    }
  }

  const addItem = () => {
    const itemId = Date.now()
    const item = {
      id: itemId,
      title: '미정',
      desc: '설명없음',
      img: 'no-image',
      percentage: 0,
      editMode: false,
    }
    let temp = items.slice(0)
    temp.push(item)
    setItems(temp)
  }

  const changeImage = (id: number) => {
    let file: any = document.createElement('input')
    file.type = 'file'
    file.accept = '.jpg, .png, .gif, .webp'
    file.addEventListener('change', async (file: any) => {
      let image = file.target.files[0]
      const path = 'poll-image/' + Date.now() + ':' + image.name
      const storageRef = ref(storage, path)
      uploadBytes(storageRef, image).then(async (snapshot) => {
        getDownloadURL(snapshot.ref).then(async (downUrl) => {
          changeItem(id, 'img', downUrl)
        })
      })
    })
    file.click()
  }

  const changeImage2 = async (id: number) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.jpg, .png, .gif, .webp'

    input.addEventListener('change', async (event: any) => {
      const file = event.target.files?.[0]
      if (!file) return

      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/poll-image', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      changeItem(id, 'img', data.url)
      // 여기서 DB 업데이트 or items 배열 업데이트 등 하면 됨
    })

    input.click()
  }

  const changeEditMode = (id: number) => {
    setItems((prev: any[]) =>
      prev.map((item) =>
        item.id === id ? { ...item, editMode: !item.editMode } : item,
      ),
    )
  }

  const cancelEditMode = (id: number) => {
    setItems((prev: any[]) =>
      prev.map((item) => {
        if (item.id !== id) return item

        const proto = protoItems.find((p: any) => p.id === id)
        if (!proto) {
          return { ...item, editMode: false }
        }
        return { ...proto, editMode: false }
      }),
    )
  }

  const changeItem = (id: number, type: string, value: string) => {
    setItems((prev: any) =>
      prev.map((item: any) => {
        if (item.id !== id) return { ...item }
        const updated = { ...item }
        if (type === 'title') updated.title = value
        if (type === 'desc') updated.desc = value
        if (type === 'img') updated.img = value
        return updated
      }),
    )
  }

  const deleteItem = (id: number) => {
    const temp = []
    for (let i = 0; i < items.length; i++) {
      if (id !== items[i].id) temp.push(items[i])
    }
    setItems(temp)
  }

  return (
    <div className="w-full flex justify-center ism">
      <div className="w-72 relative text-white flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-between justify-between pt-2">
          <button
            onClick={() => {
              router.push('/')
            }}
          >
            <MdOutlineKeyboardBackspace className="text-3xl" />
          </button>
          <div></div>
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          <div className="w-full flex flex-col justify-center items-center">
            <div className="w-full flex flex-col w-72 pt-4 space-y-2 items-center">
              <div className="flex w-full justify-between text-black">
                <input
                  ref={pollNickRef}
                  placeholder="닉네임"
                  className="w-[45%] outline-none"
                ></input>
                <input
                  type="password"
                  ref={pollPwRef}
                  placeholder="비밀번호"
                  className="w-[45%] outline-none"
                ></input>
              </div>
              <input
                className="text-black w-full outline-none"
                ref={pollNameRef}
                placeholder="투표이름"
              ></input>
              <textarea
                className="text-black w-full resize-none outline-nones"
                ref={pollDescRef}
                placeholder="어떤 투표인지 설명"
              ></textarea>
              <div className="w-full flex items-between justify-between">
                <div>중복 허용 최대 개수</div>
                <input
                  ref={pollDupRef}
                  className="text-black w-36 outline-none"
                  type="number"
                  min="1"
                ></input>
              </div>
              <DatePicker pollEndRef={pollEndRef} />
            </div>
          </div>
          <Reorder.Group axis="y" values={items} onReorder={setItems}>
            {items.map((item: any, i: number) => {
              return (
                <Reorder.Item
                  key={item.id}
                  value={item}
                  className="w-72 flex flex-col m-5 cursor-grab active:cursor-grabbing rounded-md p-1 border border-white/20"
                  whileDrag={{
                    scale: 1.03,
                    boxShadow: '0 12px 25px rgba(0,0,0,0.35)',
                  }}
                  animate={{
                    scale: 1,
                    boxShadow: '0 0 0 rgba(0,0,0,0)',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <div className="flex flex-col gap-3">
                    {item.editMode ? (
                      <div className="w-full flex flex-col">
                        <button
                          className="w-full"
                          onClick={() => changeImage2(item.id)}
                        >
                          <Imag source={item.img} type="full" />
                        </button>
                        <div className="w-full flex flex-col">
                          이름 :{' '}
                          <input
                            className="text-black"
                            onChange={(e) => {
                              changeItem(items[i].id, 'title', e.target.value)
                            }}
                            value={item.title}
                          ></input>
                          설명 :{' '}
                          <textarea
                            className="text-black resize-none"
                            onChange={(e) => {
                              changeItem(item.id, 'desc', e.target.value)
                            }}
                            value={item.desc}
                          ></textarea>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full flex">
                        <Imag source={item.img} />
                        <div className="w-full flex flex-col justify-between m-4">
                          <div>이름 : {item.title}</div>
                          <div>설명 : {item.desc}</div>
                        </div>
                      </div>
                    )}
                    {items[i].editMode ? (
                      <div className="pt-2 w-full flex justify-between">
                        <button
                          onClick={() => {
                            cancelEditMode(item.id)
                          }}
                        >
                          <MdOutlineCancel />
                        </button>
                        <button
                          onClick={() => {
                            changeEditMode(item.id)
                          }}
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full flex justify-between">
                        <button
                          onClick={() => {
                            deleteItem(item.id)
                          }}
                        >
                          <FaRegTrashAlt />
                        </button>
                        <button
                          onClick={() => {
                            changeEditMode(item.id)
                          }}
                        >
                          <LuPencil />
                        </button>
                      </div>
                    )}
                  </div>
                </Reorder.Item>
              )
            })}{' '}
          </Reorder.Group>
          <button
            className="w-72 px-4 py-2 m-5 text-white font-semibold rounded-lg border border-white/20"
            onClick={addItem}
          >
            +
          </button>
          <button
            className="w-72 px-4 py-2 bg-red-800 text-white font-semibold rounded-lg shadow-md
            hover:bg-red-700 active:scale-95 transition-transform duration-150 ease-out"
            onClick={createPoll}
          >
            투표생성
          </button>
        </div>
      </div>
    </div>
  )
}
