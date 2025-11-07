'use client';

import { useEffect, useRef, useState } from 'react';
import { storage } from '../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { IoIosClose } from 'react-icons/io';
import Menu from '@/component/menu';
import Spinner from '@/component/spinner';

export default function Home() {
    const router = useRouter();
    return (
        <div className="w-full relative bg-black text-white flex flex-col items-center justify-start h-screen">
            <button
                onClick={() => {
                    router.push('/poll');
                }}
            >
                투표 만들러 가기
            </button>
        </div>
    );
}
