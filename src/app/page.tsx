'use client';

import { useEffect, useRef, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import Spinner from '@/component/spinner';
import Poll from '../component/poll';

export default function Home() {
  const [polls, setPolls] = useState<any>([]);
  const [pod, setPod] = useState<any>(null);

  const getTodaySetting = async () => {
    const result = await fetch(`/api/main`, {
      method: 'GET',
      cache: 'no-store',
    });
    const final = await result.json();
    setPolls(final.data.polls.map((item: any) => JSON.parse(item.categories))); // 게시판을 만든다면 사용
    const obj = final.data.pod;
    if (obj?.categories) {
      obj.categories = JSON.parse(obj.categories);
      setPod(obj);
    }
  };

  useEffect(() => {
    getTodaySetting();
  }, []);
  return (
    <div className="w-full relative text-white flex flex-col items-center justify-start h-screen">
      {pod ? <Poll data={pod} /> : <Spinner />}
    </div>
  );
}
