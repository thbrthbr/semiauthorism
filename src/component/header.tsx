'use client';

import { useRouter } from 'next/navigation';
import { RiChatPollLine } from 'react-icons/ri';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useState } from 'react';
import Modal from './modal';
import Search from './search';

export default function Header() {
  const router = useRouter();
  const [modalOn, setModalOn] = useState<boolean>(false);
  return (
    <div className="bg-black h-12 w-full fixed top-0 left-0 z-50 shadow-md flex justify-between items-center px-4">
      {modalOn && (
        <Modal onClose={() => setModalOn(false)}>
          <Search />
        </Modal>
      )}
      <div className="absolute"></div>
      <button className="noselect text-[#D34E4E] text-3xl">
        {/* <RxHamburgerMenu /> */}
      </button>
      <button
        onClick={() => {
          router.push('/');
        }}
        className="noselect text-[#D34E4E] text-4xl"
      >
        <RiChatPollLine />
      </button>
      <button
        onClick={() => {
          setModalOn(!modalOn);
        }}
        className="noselect text-[#D34E4E] text-2xl"
      >
        <FaMagnifyingGlass />
      </button>
    </div>
  );
}
