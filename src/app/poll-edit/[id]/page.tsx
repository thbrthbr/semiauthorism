'use client';

import { useEffect, useRef, useState } from 'react';
import { storage } from '../../../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams, useRouter } from 'next/navigation';
import { IoIosClose } from 'react-icons/io';
import Menu from '@/component/menu';
import Spinner from '@/component/spinner';
import defaultImg from '../../asset/no-image.png';

export default function PollEdit() {
  const param = useParams();
  const [poll, setPoll] = useState<any>();
  const getPoll = async () => {
    const result = await fetch(`/api/text/${param.id}`, {
      method: 'GET',
      cache: 'no-store',
    });
    //id도 보내야함
  };
  useEffect(() => {}, []);
  return (
    <div className="w-full relative bg-black text-white flex flex-col items-center justify-start h-screen"></div>
  );
}
