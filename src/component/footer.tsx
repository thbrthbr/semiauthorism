'use client';

import { useRouter } from 'next/navigation';
import { FaDiscord } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';

export default function Footer() {
  const router = useRouter();
  return (
    <div className="h-12 w-full bottom-0 left-0 z-50 shadow-md flex flex-col justify-end items-end p-2">
      <div className="flex justify-end">
        <FaDiscord
          style={{
            fontSize: '15px',
          }}
        />
        <span className="text-[10px]"> 51(testouch)</span>
      </div>
      <div className="flex justify-end">
        <MdOutlineEmail
          style={{
            fontSize: '15px',
          }}
        />
        <span className="text-[10px]">boyosagrance@gmail.com</span>
      </div>
    </div>
  );
}
