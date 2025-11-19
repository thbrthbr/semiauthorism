import { useEffect, useState } from 'react';
import Imag from './image';
import { useRouter } from 'next/navigation';
import { MdOutlineEdit } from 'react-icons/md';
import ClickHeartArea from './heart';
import ConfettiHeartArea from './heart';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default function Poll({ data }: any) {
  const [selected, setSelected] = useState<any>([]);
  const [voted, setVoted] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const router = useRouter();

  const selectHandler = (id: number) => {
    const temp = [...selected];
    const index = temp.indexOf(id);
    if (index !== -1) {
      temp.splice(index, 1);
    } else {
      if (temp.length === data.dup) {
        alert(`최대 ${data.dup}명까지 선택 가능합니다`);
      } else {
        temp.push(id);
      }
    }
    setSelected(temp);
  };

  const editHandler = async () => {
    const prompt = window.prompt('비밀번호를 입력하세요');
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/pw`, {
      method: 'POST',
      body: JSON.stringify({
        pw: prompt,
      }),
      cache: 'no-store',
    });
    const final = await res.json();
    if (final.message == 'OK') {
      router.push(`/poll-edit/${data.id}`);
    }
  };

  const vote = async () => {
    const temp = [...selected];
    if (temp.length < 1) {
      alert('최소 하나의 항목을 골라주세요!');
      return;
    }
    if (localStorage.getItem(`voter:${data.publicId}`)) {
      alert('이미 투표하셨습니다!');
      return;
    } else {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/vote`, {
        method: 'POST',
        body: JSON.stringify({
          id: data.id,
          vote: temp,
          voter: result.visitorId,
        }),
        cache: 'no-store',
      });

      const final = await res.json();
      if (final.message == '이미투표함') {
        alert('이미 투표하셨습니다!');
        localStorage.setItem(`voter:${data.publicId}`, result.visitorId);
        router.push(`/result/${data.publicId}`);
      } else {
        alert('투표완료! 가까운 시일 내 최종결과가 공개됩니다!');
        localStorage.setItem(`voter:${data.publicId}`, result.visitorId);
        router.push(`/result/${data.publicId}`);
      }
    }
  };

  useEffect(() => {
    if (data) {
      if (localStorage.getItem(`voter:${data.publicId}`)) {
        setVoted(true);
      }
    }
  }, [data]);

  return (
    data && (
      <div className="relative w-full m-8 justify-center items-center flex flex-col">
        <div className="flex">
          <div
            onContextMenu={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setEditMode(!editMode);
            }}
            className="text-5xl w-full justify-center italic flex ism"
          >
            {data.title}
          </div>
          {editMode && (
            <button onClick={editHandler}>
              <MdOutlineEdit />
            </button>
          )}
        </div>
        {data?.categories.map((item: any) => {
          return (
            <ConfettiHeartArea heartCount={10} key={item.id}>
              <button
                onContextMenu={(e) => {
                  e.preventDefault();
                }}
                onClick={() => {
                  selectHandler(item.id);
                }}
                className={`overflow-hidden rounded-lg mt-4 w-72 flex flex-col items-center border-4 ${selected.includes(item.id) ? 'border-white' : 'border-black'} active:scale-95 transition-transform duration-200 ease-out`}
              >
                <Imag source={item.img} />
                <div className="bg-black w-full py-4 space-y-2 ">
                  <div className="text-4xl pdh">{item.title}</div>
                  <div className="text-[13px] ism">{item.desc}</div>
                </div>
                {/* <div>{item.percentage}표</div> */}
              </button>
            </ConfettiHeartArea>
          );
        })}
        <br></br>
        {voted ? (
          <div className="w-72">
            <div className="px-4 py-2 bg-black text-center text-white font-semibold rounded-lg shadow-md">
              투표완료
            </div>
            <br></br>
            <button
              onClick={() => {
                router.push(`/result/${data.publicId}`);
              }}
              className="w-full px-4 py-2 bg-red-800 text-white font-semibold rounded-lg shadow-md
            hover:bg-red-700 active:scale-95 transition-transform duration-150 ease-out"
            >
              결과현황 보러가기
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => {
                console.log(`${process.env.NEXT_PUBLIC_SITE}`);
              }}
            >
              test
            </button>
            <button
              onClick={vote}
              className="w-72 px-4 py-2 bg-red-800 text-white font-semibold rounded-lg shadow-md
            hover:bg-red-700 active:scale-95 transition-transform duration-150 ease-out"
            >
              투표하기
            </button>
          </>
        )}
      </div>
    )
  );
}
