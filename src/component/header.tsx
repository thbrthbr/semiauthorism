'use client';

import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  return (
    <div className="bg-black h-12 w-full fixed top-0 left-0 z-50 shadow-md flex justify-center items-center">
      <button
        onClick={() => {
          router.push('/');
        }}
        className="noselect text-[#D34E4E] lobster text-3xl"
      >
        POLL
      </button>
    </div>
  );
}
