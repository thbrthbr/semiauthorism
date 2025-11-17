'use client';

import { useEffect, useRef, useState } from 'react';
import { storage } from '../../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams, useRouter } from 'next/navigation';
import { IoIosClose } from 'react-icons/io';
import Menu from '@/component/menu';
import Spinner from '@/component/spinner';
import defaultImg from '../../asset/no-image.png';
import Imag from '@/component/image';
import { PercentBar } from '@/component/bar';

export default function Admin() {
  const param = useParams();
  const router = useRouter();
  const [items, setItems] = useState<any>(null);
  const [target, setTarget] = useState<any>(null);

  const getPolls = async () => {
    const result = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/main`, {
      method: 'GET',
      cache: 'no-store',
    });
    const final = await result.json();
    setItems(final.data.polls);
  };

  const changePod = async (pod: string) => {
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
    }
  };

  useEffect(() => {
    getPolls();
  }, []);

  return (
    <div className="w-full flex jutify-center items-center flex-col text-white">
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
          router.push('/poll');
        }}
      >
        투표만들기
      </button>
    </div>
  );
}
