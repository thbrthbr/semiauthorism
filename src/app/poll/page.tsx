'use client';

import { useEffect, useRef, useState } from 'react';
import { storage } from '../../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { IoIosClose } from 'react-icons/io';
import Menu from '@/component/menu';
import Spinner from '@/component/spinner';
import defaultImg from '../../asset/no-image.png';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({
    x: -1,
    y: -1,
  });
  const [modSwitch, setModSwitch] = useState<any>([]);
  const [isOpened, setIsOpened] = useState(false);
  const [datas, setDatas] = useState<any>([]);
  const [items, setItems] = useState<any>([]);
  const [modal, setModal] = useState<boolean>(false);
  // const [originTitle, setOriginTitle] = useState('')
  // const [tempTitle, setTempTitle] = useState('')
  const pwRef = useRef<any>(null);
  const router = useRouter();

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

  const openForAWhile = () => {
    const item = localStorage.getItem('semiauthorism');
    if (item) {
      const parsed = JSON.parse(item);
      const currentTime = Date.now();
      if (parsed.expiresAt > currentTime) {
        setIsOpened(parsed.value);
      } else {
        localStorage.removeItem('semiauthorism');
      }
    }
  };

  const addTXT = async () => {
    try {
      let file: any = document.createElement('input');
      file.type = 'file';
      file.addEventListener('change', async () => {
        if (file.files[0].type !== 'text/plain') {
          alert('txt 파일만 올릴 수 있습니다');
          return;
        }
        const fileName = file.files[0].name;
        const fileRef = ref(storage, `texts/${fileName}.txt`);
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
            );
            const final = await brought.json();
            const semi = datas.slice(0);
            semi.unshift(final.data);
            setDatas(semi);
            setLocation({
              x: -1,
              y: -1,
            });
          });
        });
      });
      file.click();
    } catch (e) {}
  };

  const makeTXTfile = () => {
    return new Blob([''], { type: 'text/plain;charset=utf-8' });
  };

  const addWritten = async () => {
    const file = makeTXTfile();
    const fileName = `untitled${Date.now()}`;
    const fileRef = ref(storage, `texts/${fileName}.txt`);
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
        );
        const final = await brought.json();
        const semi = datas.slice(0);
        semi.unshift(final.data);
        setDatas(semi);
      });
    });
  };

  const getWritten = async () => {
    const result = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/text`, {
      method: 'GET',
      cache: 'no-store',
    });
    const texts = await result.json();
    const sorted = texts.data
      .sort((x: any, y: any) => x.order - y.order)
      .reverse();
    setDatas(sorted);
    setLoading(false);
  };

  const enterText = (each: string) => {
    router.push(`/text/${each}`);
  };

  const deleteWritten = async (id: string) => {
    const willYou = window.confirm('해당 텍스트를 삭제하시겠습니까');
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
      );
      const final = await res.json();
      if (final.message == '삭제 성공') {
        const temp = [];
        for (let i = 0; i < datas.length; i++) {
          if (datas[i].id !== id) {
            temp.push(datas[i]);
          }
        }
        setDatas(temp);
      }
    }
  };

  const editTitle = async (id: string, newTitle: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/text/edit-title`, {
      method: 'POST',
      body: JSON.stringify({
        id,
        newTitle,
      }),
      cache: 'no-store',
    });
  };

  // @@@@@@@@@@@@@@@@@@@@@@@@

  const createPoll = async (id: string, desc: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/poll/create`, {
      method: 'POST',
      body: JSON.stringify({
        id,
        desc,
      }),
      cache: 'no-store',
    });
  };

  const addItem = () => {
    const itemId = Date.now();
    const item = {
      id: itemId,
      title: '미정',
      desc: '설명없음',
      img: 'no-image',
      editMode: false,
    };
    let temp = items.slice(0);
    temp.push(item);
    setItems(temp);
  };

  const changeImage = () => {
    let file: any = document.createElement('input');
    file.type = 'file';
    file.accept = '.jpg, .png, .gif, .webp';
    file.addEventListener('change', async (file: any) => {
      let image = file.target.files[0];
      const path = 'profileImage/' + Date.now() + ':' + image.name;
      const storageRef = ref(storage, path);
      uploadBytes(storageRef, image).then(async (snapshot) => {
        getDownloadURL(snapshot.ref).then(async (downUrl) => {
          await fetch(`http://localhost:3000/api/poll-image`, {
            method: 'POST',
            body: JSON.stringify({
              id: Date.now(),
              image: downUrl,
              nick: null,
            }),
            cache: 'no-store',
          });
        });
      });
    });
    file.click();
  };

  const changeEditMode = (id: number) => {
    console.log(id);
    let temp = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        const tempObj = items[i];
        if (items[i].editMode === true) {
        }
        tempObj.editMode = !items[i].editMode;
        temp.push(tempObj);
      } else {
        temp.push(items[i]);
      }
    }
    setItems(temp);
  };

  const changeItem = (id: number, type: string, value: string) => {
    let temp = [];
    let obj: any = {};
    for (let i = 0; i < items.length; i++) {
      if (id === items[i].id && value) {
        obj = { ...items[i] };
        if (type === 'title') {
          obj.title = value;
        } else if (type == 'desc') {
          obj.desc = value;
        }
        temp.push(obj);
      } else {
        temp.push(items[i]);
      }
    }
    setItems(temp);
  };

  const deleteItem = (id: number) => {
    const temp = [];
    for (let i = 0; i < items.length; i++) {
      if (id !== items[i].id) temp.push(items[i]);
    }
    setItems(temp);
  };

  const getVote = () => {};

  const addVote = () => {};

  useEffect(() => {
    openForAWhile();
  }, []);

  useEffect(() => {}, []);

  return (
    <div className="w-full relative bg-black text-white flex flex-col items-center justify-start h-screen">
      <button
        onClick={() => {
          router.push('/');
        }}
      >
        투표로 돌아가기
      </button>
      <div className="w-full flex flex-col justify-center items-center">
        <div>
          <input placeholder="투표이름"></input>
          <input placeholder="어떤 투표인지 설명"></input>
        </div>
        {items.map((item: any, i: number) => {
          return (
            <div className="w-72 flex flex-col m-5" key={i}>
              {item.editMode ? (
                <div className="w-full flex flex-col">
                  <button onClick={changeImage}>이미지수정</button>
                  <div className="w-full flex flex-col">
                    이름 :{' '}
                    <input
                      onChange={(e) => {
                        console.log(e.target.value);
                        changeItem(items[i].id, 'title', e.target.value);
                      }}
                      value={items[i].title}
                    ></input>
                    설명 :{' '}
                    <input
                      onChange={(e) => {
                        console.log(e.target);
                        changeItem(items[i].id, 'desc', e.target.value);
                      }}
                      value={items[i].desc}
                    ></input>
                  </div>
                </div>
              ) : (
                <div className="w-full flex">
                  <img className="w-24 h-24" src={defaultImg.src}></img>
                  <div className="w-full flex flex-col justify-between m-4">
                    <div>이름 : {item.title}</div>
                    <div>미정 : {item.desc}</div>
                  </div>
                </div>
              )}
              <div className="w-full flex justify-between">
                <button
                  onClick={() => {
                    changeEditMode(item.id);
                  }}
                >
                  수정
                </button>
                <button
                  onClick={() => {
                    deleteItem(item.id);
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          );
        })}
        <button onClick={addItem}>추가용</button>
      </div>
    </div>
  );
}
