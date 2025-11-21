'use client';

import { useEffect, useState } from 'react';

export default function UpButton() {
  const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
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
        onClick={scrollToTop}
        className="fixed bottom-10 w-12 right-5 p-3 rounded-full bg-white text-black shadow-lg hover:bg-gray-800 transition cursor-pointer"
      >
        ↑
      </button>
    )
  );
}
