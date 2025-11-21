'use client';

import { useEffect, useRef, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams, useRouter } from 'next/navigation';
import Spinner from '@/component/spinner';
import Poll from '../../../component/poll';

export default function Home() {
  const router = useRouter();
  const param = useParams();
  const [poll, setPoll] = useState<any>(null);

  const getPoll = async () => {
    const result = await fetch(`/api/poll/${param.id}`, {
      method: 'GET',
      cache: 'no-store',
    });
    const final = await result.json();
    const obj = final.data[0];
    obj.categories = JSON.parse(obj.categories);
    setPoll(obj);
  };

  useEffect(() => {
    getPoll();
  }, []);
  return (
    <div className="w-full relative text-white flex flex-col items-center justify-start">
      {poll ? <Poll data={poll} /> : <Spinner />}
    </div>
  );
}
