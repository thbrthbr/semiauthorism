'use client';

import { useEffect, useState } from 'react';
import { FaArrowDown } from 'react-icons/fa6';

export default function DownButton() {
  const [showButton, setShowButton] = useState(false);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY <
        document.body.scrollHeight - 200
      ) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    showButton && (
      <button
        onClick={scrollToBottom}
        className="fixed bottom-3 right-3 w-10 p-3 rounded-full bg-white text-[#d34e4e] shadow-lg hover:bg-gray-800 transition cursor-pointer"
      >
        <FaArrowDown />
      </button>
    )
  );
}
