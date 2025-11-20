'use client';

import { useRouter } from 'next/navigation';
import { RiChatPollLine } from 'react-icons/ri';

export default function Header() {
  const router = useRouter();
  return (
    <div className="bg-black h-12 w-full fixed top-0 left-0 z-50 shadow-md flex justify-center items-center">
      <button
        onClick={() => {
          router.push('/');
        }}
        className="noselect text-[#D34E4E] text-4xl"
      >
        <RiChatPollLine />
      </button>
    </div>
  );
}
