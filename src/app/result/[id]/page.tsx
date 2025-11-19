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

export default function Result() {
  const param = useParams();
  const router = useRouter();
  const [title, setTitle] = useState<any>('');
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
    let itemArr = JSON.parse(final?.data[0]?.categories);
    const real = itemArr.reduce((acc: any, cur: any) => {
      const votes = cur.percentage;
      return acc + votes;
    }, 0);
    setTitle(final?.data[0]?.title);
    setItems({ poll: itemArr, total: real });
  };

  useEffect(() => {
    getPoll();
  }, []);
  return (
    <div className="p-8 w-full flex jutify-center items-center flex-col text-white">
      <div
        onContextMenu={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className="text-5xl w-full justify-center flex ism"
      >
        {title}
      </div>
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
                className={`overflow-hidden rounded-lg mt-4 w-72 flex flex-col items-center border-4 border-black`}
              >
                <Imag source={item.img} />
                <div className="bg-black w-full py-4 space-y-2 flex justify-center flex-col items-center">
                  <div className="text-4xl pdh">{item.title}</div>
                  <div className="text-[13px] ism">{item.desc}</div>
                  <div className="text-[13px] ism">{item.percentage}표</div>
                  <PercentBar value={eachPer} />
                </div>
              </div>
            </div>
          );
        })}
      <br></br>
      <button
        className="w-72 px-4 py-2 bg-blue-800 text-white font-semibold rounded-lg shadow-md
            hover:bg-red-700 active:scale-95 transition-transform duration-150 ease-out"
        onClick={() => {
          router.back();
        }}
      >
        투표로 돌아가기
      </button>
      <br></br>
    </div>
  );
}
