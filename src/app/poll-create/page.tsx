'use client';

import { useEffect, useRef, useState } from 'react';
import { storage } from '../../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { IoIosClose } from 'react-icons/io';
import Menu from '@/component/menu';
import Spinner from '@/component/spinner';
import defaultImg from '../../asset/no-image.png';
import { Reorder } from 'framer-motion';

export default function PollCreate() {
  const [items, setItems] = useState<any>([]);
  const [protoItems, setProtoItems] = useState<any>([]);
  const [locked, setLocked] = useState<boolean>(true);
  const pollNameRef = useRef<any>(null);
  const pollDescRef = useRef<any>(null);
  const pollDupRef = useRef<any>(null);
  const router = useRouter();

  const auth = async () => {
    const prompt = window.prompt('비밀번호를 입력하세요');
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/pw`, {
      method: 'POST',
      body: JSON.stringify({
        pw: prompt,
      }),
      cache: 'no-store',
    });
    const final = await res.json();
    if (final.message == 'OK') {
      setLocked(false);
    }
  };
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
    if (!pollNameRef.current.value || !pollDescRef.current.value) {
      alert('투표의 제목과 설명을 적어주세요');
      return;
    }
    if (items.length < 2) {
      alert('투표대상을 최소 2개를 생성해주세요');
      return;
    }
    const item = [...items];
    const send = JSON.stringify(item);
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/poll`, {
      method: 'POST',
      body: JSON.stringify({
        pw: 'temp',
        type: 'create',
        title: pollNameRef.current.value,
        desc: pollDescRef.current.value,
        dup: pollDupRef.current.value,
        categories: send,
      }),
      cache: 'no-store',
    });

    const final = await res.json();
    if (final.message == '투표생성됨') {
      alert('투표가 생성되었습니다');
      router.push('/');
    }
  };

  const addItem = () => {
    const itemId = Date.now();
    const item = {
      id: itemId,
      title: '미정',
      desc: '설명없음',
      img: 'no-image',
      percentage: 0,
      editMode: false,
    };
    let temp = items.slice(0);
    temp.push(item);
    setItems(temp);
  };

  const changeImage = (id: number) => {
    let file: any = document.createElement('input');
    file.type = 'file';
    file.accept = '.jpg, .png, .gif, .webp';
    file.addEventListener('change', async (file: any) => {
      let image = file.target.files[0];
      const path = 'poll-image/' + Date.now() + ':' + image.name;
      const storageRef = ref(storage, path);
      uploadBytes(storageRef, image).then(async (snapshot) => {
        getDownloadURL(snapshot.ref).then(async (downUrl) => {
          changeItem(id, 'img', downUrl);
        });
      });
    });
    file.click();
  };

  const changeEditMode = (id: number) => {
    setItems((prev: any[]) =>
      prev.map((item) =>
        item.id === id ? { ...item, editMode: !item.editMode } : item,
      ),
    );
  };

  const cancelEditMode = (id: number) => {
    setItems((prev: any[]) =>
      prev.map((item) => {
        if (item.id !== id) return item; // 다른 애들은 그대로 둔다

        const proto = protoItems.find((p: any) => p.id === id);
        if (!proto) {
          // 혹시 proto가 없으면 최소한 editMode만 끄자
          return { ...item, editMode: false };
        }

        // 원본 값으로 되돌리고 editMode는 false로
        return { ...proto, editMode: false };
      }),
    );
  };

  const changeItem = (id: number, type: string, value: string) => {
    setItems((prev: any) =>
      prev.map((item: any) => {
        if (item.id !== id) return { ...item }; // 항상 복사

        const updated = { ...item };
        if (type === 'title') updated.title = value;
        if (type === 'desc') updated.desc = value;
        if (type === 'img') updated.img = value;

        return updated;
      }),
    );
  };

  const deleteItem = (id: number) => {
    const temp = [];
    for (let i = 0; i < items.length; i++) {
      if (id !== items[i].id) temp.push(items[i]);
    }
    setItems(temp);
  };

  useEffect(() => {
    auth();
  }, []);

  return (
    <div className="w-full relative text-white flex flex-col items-center justify-start h-screen">
      <button
        onClick={() => {
          router.push('/');
        }}
      >
        투표로 돌아가기
      </button>
      {locked === false && (
        <div className="w-full flex flex-col justify-center items-center">
          <div className="w-full flex flex-col justify-center items-center">
            <div className="flex flex-col w-72 pt-4 space-y-2 items-center">
              <input
                className="text-black w-full"
                ref={pollNameRef}
                placeholder="투표이름"
              ></input>
              <textarea
                className="text-black w-full"
                ref={pollDescRef}
                placeholder="어떤 투표인지 설명"
              ></textarea>
              <div>중복 허용 최대 개수</div>
              <input
                ref={pollDupRef}
                className="text-black"
                type="number"
                min="1"
              ></input>
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
                        <img
                          className="w-full"
                          src={
                            item.img === 'no-image' ? defaultImg.src : item.img
                          }
                        ></img>
                        <button
                          onClick={() => {
                            changeImage(item.id);
                          }}
                        >
                          이미지수정
                        </button>
                        <div className="w-full flex flex-col">
                          이름 :{' '}
                          <input
                            className="text-black"
                            onChange={(e) => {
                              changeItem(items[i].id, 'title', e.target.value);
                            }}
                            value={item.title}
                          ></input>
                          설명 :{' '}
                          <textarea
                            className="text-black"
                            onChange={(e) => {
                              changeItem(item.id, 'desc', e.target.value);
                            }}
                            value={item.desc}
                          ></textarea>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full flex">
                        <img
                          className="w-24 h-24"
                          src={
                            item.img === 'no-image' ? defaultImg.src : item.img
                          }
                        ></img>
                        <div className="w-full flex flex-col justify-between m-4">
                          <div>이름 : {item.title}</div>
                          <div>미정 : {item.desc}</div>
                        </div>
                      </div>
                    )}
                    <div className="w-full flex justify-between">
                      {items[i].editMode ? (
                        <button
                          onClick={() => {
                            cancelEditMode(item.id);
                          }}
                        >
                          취소
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            deleteItem(item.id);
                          }}
                        >
                          삭제
                        </button>
                      )}
                      <button
                        onClick={() => {
                          changeEditMode(item.id);
                        }}
                      >
                        수정
                      </button>
                    </div>
                  </div>
                </Reorder.Item>
              );
            })}{' '}
          </Reorder.Group>
          <button onClick={addItem}>추가</button>
          <button onClick={createPoll}>투표생성</button>
        </div>
      )}
    </div>
  );
}
