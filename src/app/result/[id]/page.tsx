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
  const [items, setItems] = useState();

  const getPoll = async () => {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_SITE}/api/poll/${param.id}`,
      {
        method: 'GET',
        cache: 'no-store',
      },
    );
    const final = await result.json();
    console.log(final);
    const itemArr = JSON.parse(final?.data[0]?.categories);
    setItems(itemArr);
  };

  useEffect(() => {
    getPoll();
  }, []);
  return <div>{}</div>;
}
