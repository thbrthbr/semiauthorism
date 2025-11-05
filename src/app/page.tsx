'use client';

import { useEffect, useRef, useState } from 'react';
import { storage } from '../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { IoIosClose } from 'react-icons/io';
import Menu from '@/component/menu';
import Spinner from '@/component/spinner';

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState({
        x: -1,
        y: -1,
    });
    const [modSwitch, setModSwitch] = useState(-1);
    const [isOpened, setIsOpened] = useState(false);
    const [datas, setDatas] = useState<any>([]);
    const [items, setItems] = useState<any>([]);
    const [modal, setModal] = useState<boolean>(false);
    // const [originTitle, setOriginTitle] = useState('')
    // const [tempTitle, setTempTitle] = useState('')
    const pwRef = useRef<any>(null);
    const router = useRouter();

    // const insertPW = () => {
    //   if (pwRef.current) {
    //     if (pwRef.current.value == process.env.NEXT_PUBLIC_PW) {
    //       const expirationTime = Date.now() + 24 * 60 * 60 * 1000
    //       const data = { value: true, expiresAt: expirationTime }
    //       localStorage.setItem('semiauthorism', JSON.stringify(data))
    //       setIsOpened(true)
    //     } else {
    //       pwRef.current.value = ''
    //     }
    //   }
    // }

    const openForAWhile = () => {
        const item = localStorage.getItem('semiauthorism');
        if (item) {
            const parsed = JSON.parse(item);
            const currentTime = Date.now();
            if (parsed.expiresAt > currentTime) {
                setIsOpened(parsed.value);
            } else {
                localStorage.removeItem('semiauthorism');
            }
        }
    };

    const addTXT = async () => {
        try {
            let file: any = document.createElement('input');
            file.type = 'file';
            file.addEventListener('change', async () => {
                if (file.files[0].type !== 'text/plain') {
                    alert('txt 파일만 올릴 수 있습니다');
                    return;
                }
                const fileName = file.files[0].name;
                const fileRef = ref(storage, `texts/${fileName}.txt`);
                await uploadBytes(fileRef, file.files[0]).then(async (snapshot) => {
                    getDownloadURL(snapshot.ref).then(async (downUrl) => {
                        const brought = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/text`, {
                            method: 'POST',
                            body: JSON.stringify({
                                title: fileName,
                                path: downUrl,
                                order: Date.now(),
                                realTitle: fileName,
                            }),
                            cache: 'no-store',
                        });
                        const final = await brought.json();
                        const semi = datas.slice(0);
                        semi.unshift(final.data);
                        setDatas(semi);
                        setLocation({
                            x: -1,
                            y: -1,
                        });
                    });
                });
            });
            file.click();
        } catch (e) {}
    };

    const makeTXTfile = () => {
        return new Blob([''], { type: 'text/plain;charset=utf-8' });
    };

    const addWritten = async () => {
        const file = makeTXTfile();
        const fileName = `untitled${Date.now()}`;
        const fileRef = ref(storage, `texts/${fileName}.txt`);
        await uploadBytes(fileRef, file).then(async (snapshot) => {
            getDownloadURL(snapshot.ref).then(async (downUrl) => {
                const brought = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/text`, {
                    method: 'POST',
                    body: JSON.stringify({
                        title: fileName,
                        path: downUrl,
                        order: Date.now(),
                        realTitle: fileName,
                    }),
                    cache: 'no-store',
                });
                const final = await brought.json();
                const semi = datas.slice(0);
                semi.unshift(final.data);
                setDatas(semi);
            });
        });
    };

    const getWritten = async () => {
        const result = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/text`, {
            method: 'GET',
            cache: 'no-store',
        });
        const texts = await result.json();
        const sorted = texts.data.sort((x: any, y: any) => x.order - y.order).reverse();
        setDatas(sorted);
        setLoading(false);
    };

    const enterText = (each: string) => {
        router.push(`/text/${each}`);
    };

    const deleteWritten = async (id: string) => {
        const willYou = window.confirm('해당 텍스트를 삭제하시겠습니까');
        if (willYou) {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/text/delete`, {
                method: 'DELETE',
                body: JSON.stringify({
                    id,
                }),
                cache: 'no-store',
            });
            const final = await res.json();
            if (final.message == '삭제 성공') {
                const temp = [];
                for (let i = 0; i < datas.length; i++) {
                    if (datas[i].id !== id) {
                        temp.push(datas[i]);
                    }
                }
                setDatas(temp);
            }
        }
    };

    const editTitle = async (id: string, newTitle: string) => {
        await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/text/edit-title`, {
            method: 'POST',
            body: JSON.stringify({
                id,
                newTitle,
            }),
            cache: 'no-store',
        });
    };

    // @@@@@@@@@@@@@@@@@@@@@@@@

    const createPoll = async (id: string, desc: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/poll/create`, {
            method: 'POST',
            body: JSON.stringify({
                id,
                desc,
            }),
            cache: 'no-store',
        });
    };

    const addItem = () => {
        const item = {
            id: '',
            title: '',
            desc: '',
        };
        let temp = items;
        temp.push(item);
        setItems(temp);
    };

    const deleteItem = (id: number) => {
        const temp = [];
        for (let i = 0; i < items.length; i++) {
            if (id !== items.id) temp.push(items[i]);
        }
        setItems(temp);
    };

    const getVote = () => {};

    const addVote = () => {};

    useEffect(() => {
        openForAWhile();
    }, []);

    useEffect(() => {}, []);

    return (
        <div className="relative bg-black text-white flex flex-col items-center justify-start h-screen">
            {modal ? (
                <div>
                    <input placeholder="투표이름"></input>
                    <input placeholder="어떤 투표인지 설명"></input>
                    {items.map((item: any, i: number) => {
                        return (
                            <div className="w-20 h-20" key={i}>
                                이름 : <input></input>
                                설명 : <input></input>
                                <button
                                    onClick={() => {
                                        deleteItem(item.id);
                                    }}
                                >
                                    삭제
                                </button>
                            </div>
                        );
                    })}
                    <button onClick={addItem}>추가용</button>
                </div>
            ) : null}

            <button
                onClick={() => {
                    let res = modal ? false : true;
                    setModal(res);
                }}
            >
                투표 만들기
            </button>
        </div>
    );
}
