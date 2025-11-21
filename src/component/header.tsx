'use client';

import { useRouter } from 'next/navigation';
import { RiChatPollLine } from 'react-icons/ri';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useState } from 'react';
import Modal from './modal';
import Search from './search';
import { LuPencil } from 'react-icons/lu';
import { FiPlus } from 'react-icons/fi';

export default function Header() {
  const router = useRouter();
  const [modalOn, setModalOn] = useState<boolean>(false);
  return (
    <div className="bg-black h-14 w-full fixed top-0 left-0 z-50 shadow-md flex justify-between items-center pr-4 pl-2">
      {modalOn && (
        <Modal onClose={() => setModalOn(false)}>
          <Search />
        </Modal>
      )}
      <div className="absolute"></div>
      <button
        onClick={() => {
          router.push('/poll-create');
        }}
        className="noselect text-[#D34E4E] text-4xl"
      >
        <FiPlus />
      </button>
      <button
        onClick={() => {
          router.push('/');
        }}
        className="noselect text-[#D34E4E] text-4xl flex items-center"
      >
        <div className="lobster">POLLISM</div>
        <RiChatPollLine className="noselect text-[#D34E4E] text-4xl" />
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
