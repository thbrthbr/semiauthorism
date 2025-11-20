'use client';

import { useEffect, useRef, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import Spinner from '@/component/spinner';
import Poll from '../component/poll';
import Polls from '@/component/polls';

export default function Home() {
  const [polls, setPolls] = useState<any>([]);
  const [pod, setPod] = useState<any>(null);
  const [showPolls, setShowPolls] = useState<boolean>(false);

  const getTodaySetting = async () => {
    const result = await fetch(`/api/main`, {
      method: 'GET',
      cache: 'no-store',
    });
    const final = await result.json();
    setPolls(
      final.data.polls.map((item: any, i: number) => {
        return { ...item, categories: JSON.parse(item.categories) };
      }),
    );
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
    <div className="w-full relative text-white flex flex-col items-center justify-start">
      {pod ? <Poll data={pod} /> : <Spinner />}
      <button
        onClick={() => {
          setShowPolls(!showPolls);
        }}
        className="w-72 px-4 py-2 bg-white text-black font-semibold rounded-lg shadow-md
          hover:bg-gray-200 active:scale-95 transition-transform duration-150 ease-out"
      >
        {showPolls ? '접기' : '다른 투표들 보기'}
      </button>
      {showPolls && <Polls datas={polls} pod={pod} />}
    </div>
  );
}
