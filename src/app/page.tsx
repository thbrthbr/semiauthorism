'use client';

import { useEffect, useRef, useState } from 'react';
import { storage } from '../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { IoIosClose } from 'react-icons/io';
import Menu from '@/component/menu';
import Spinner from '@/component/spinner';
import Poll from '../component/poll';
import { MdOutlineEdit } from 'react-icons/md';

export default function Home() {
  const [polls, setPolls] = useState<any>([]);
  const [pod, setPod] = useState<any>(null);
  const router = useRouter();
  const auth = () => {
    const prompt = window.prompt('비밀번호를 입력하세요');
    if (prompt == 'hengbengquatrobe') {
      router.push('/poll');
    }
  };

  const getTodaySetting = async () => {
    const result = await fetch(`/api/main`, {
      method: 'GET',
      cache: 'no-store',
    });
    const final = await result.json();
    setPolls(final.data.polls.map((item: any) => JSON.parse(item.categories)));
    const obj = final.data.pod;
    obj.categories = JSON.parse(obj.categories);
    setPod(obj);
  };

  useEffect(() => {
    getTodaySetting();
  }, []);
  return (
    <div className="w-full relative bg-black text-white flex flex-col items-center justify-start h-screen">
      <Poll data={pod} />
      {/* <button
        onClick={() => {
          router.push(`/poll-edit/${2}`);
        }}
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg shadow-black/30"
      >
        <MdOutlineEdit />
      </button> */}
    </div>
  );
}
