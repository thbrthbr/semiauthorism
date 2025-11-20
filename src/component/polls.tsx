import { useEffect, useState } from 'react';
import Imag from './image';
import { useRouter } from 'next/navigation';
import { MdOutlineEdit } from 'react-icons/md';
import ClickHeartArea from './heart';
import ConfettiHeartArea from './heart';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default function Polls({ datas, pod }: any) {
  return (
    <div className="relative w-72 m-8 justify-center items-center flex flex-col">
      {datas.map((data: any) => {
        if (data.id == pod.id) {
          return;
        }
        return (
          <button
            className="w-full flex p-1 border border-2 border-white/20 my-1 rounded-md"
            key={data.id}
          >
            {data.title}
          </button>
        );
      })}
    </div>
  );
}
