'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function Admin() {
  const param = useParams();
  const router = useRouter();
  const [items, setItems] = useState<any>(null);
  const [target, setTarget] = useState<any>(null);
  const [locked, setLocked] = useState<boolean>(true);

  const getPolls = async () => {
    auth();
    const result = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/main`, {
      method: 'GET',
      cache: 'no-store',
    });
    const final = await result.json();
    setItems(final.data.polls);
  };

  const changePod = async (pod: string) => {
    if (!target) {
      alert('먼저 골라주세요');
      return;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/main`, {
      method: 'POST',
      body: JSON.stringify({
        id: 'ASSIGN_ZERO',
        pod: pod,
      }),
      cache: 'no-store',
    });
    const final = await res.json();
    if (final.message == '메인투표수정됨') {
      alert('바뀜');
    }
  };

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

  useEffect(() => {
    getPolls();
  }, []);

  return (
    <>
      {locked ? (
        <div></div>
      ) : (
        <div className="w-full flex justify-center items-center flex-col text-white">
          <button
            onClick={() => {
              router.push('/');
            }}
          >
            투표로 이동
          </button>
          <select
            className="text-black"
            onChange={(e) => {
              console.log(e.currentTarget.value);
              setTarget(e.currentTarget.value);
            }}
          >
            {items &&
              items.map((item: any) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.title}:{item.id}
                  </option>
                );
              })}
          </select>
          <button
            onClick={() => {
              changePod(target);
            }}
          >
            메인투표변경
          </button>

          <button
            onClick={() => {
              router.push('/poll-create');
            }}
          >
            투표만들기
          </button>
        </div>
      )}
    </>
  );
}
