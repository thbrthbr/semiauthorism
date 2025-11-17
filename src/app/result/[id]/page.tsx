'use client';

import { useEffect, useRef, useState } from 'react';
import { storage } from '../../../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams, useRouter } from 'next/navigation';
import { IoIosClose } from 'react-icons/io';
import Menu from '@/component/menu';
import Spinner from '@/component/spinner';
import defaultImg from '../../asset/no-image.png';
import Imag from '@/component/image';
import { PercentBar } from '@/component/bar';

export default function PollEdit() {
  const param = useParams();
  const router = useRouter();
  const [items, setItems] = useState<any>(null);

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
    let itemArr = JSON.parse(final?.data[0]?.categories);
    const real = itemArr.reduce((acc: any, cur: any) => {
      const votes = cur.percentage;
      return acc + votes;
    }, 0);
    console.log(real);
    setItems({ poll: itemArr, total: real });
  };

  useEffect(() => {
    getPoll();
  }, []);
  return (
    <div className="w-full flex jutify-center items-center flex-col text-white">
      <button
        onClick={() => {
          router.push(`/`);
        }}
      >
        투표로 돌아가기
      </button>
      {items &&
        items.poll.map((item: any) => {
          const eachPer =
            items.total === 0
              ? 0
              : Math.round((item.percentage / items.total) * 100);
          return (
            <div key={item.id}>
              <div
                key={item.id}
                className={`px-2 py-2 overflow-hidden rounded-lg mt-4 pb-2 space-y-2 w-72 flex flex-col items-center border-4 border-white`}
              >
                <Imag source={item.img} />
                <div className="text-2xl">{item.title}</div>
                <div>{item.desc}</div>
                <div>{item.percentage}표</div>
                <PercentBar value={eachPer} />
              </div>
            </div>
          );
        })}
    </div>
  );
}
