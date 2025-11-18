import { useEffect, useState } from 'react';
import Imag from './image';
import { useRouter } from 'next/navigation';
import { MdOutlineEdit } from 'react-icons/md';

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
    if (localStorage.getItem(`${data.id}`)) {
      alert('이미 투표하셨습니다!');
      return;
    } else {
      localStorage.setItem(
        `${data.id}`,
        '공정한 투표를 위해 조작행위는 삼가부탁드려요!! ㅠㅠ',
      );
      const res = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/vote`, {
        method: 'POST',
        body: JSON.stringify({
          id: data.id,
          vote: temp,
        }),
        cache: 'no-store',
      });
      alert('투표완료! 가까운 시일 내 최종결과가 공개됩니다!');
      router.push(`/result/${data.publicId}`);
    }
  };

  useEffect(() => {
    if (data) {
      if (localStorage.getItem(`${data.id}`)) {
        setVoted(true);
      }
    }
  }, [data]);

  return (
    data && (
      <div className="relative w-full m-8 justify-center items-center flex flex-col">
        {/* <button
          onClick={editHandler}
          className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg shadow-black/30"
        >
          <MdOutlineEdit />
        </button> */}
        <div className="flex">
          <div
            onContextMenu={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setEditMode(!editMode);
            }}
            className="text-5xl w-full justify-center flex ism"
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
          console.log(item);
          return (
            <button
              onClick={() => {
                selectHandler(item.id);
              }}
              key={item.id}
              className={`overflow-hidden rounded-lg mt-4 pb-2 space-y-2 w-72 flex flex-col items-center border-4 ${selected.includes(item.id) ? 'border-sky-700' : 'border-white'}`}
            >
              <Imag source={item.img} />
              <div className="text-4xl pdh">{item.title}</div>
              <div className="text-[13px] ism">{item.desc}</div>
              {/* <div>{item.percentage}표</div> */}
            </button>
          );
        })}
        <br></br>
        {voted ? (
          <div className="w-72">
            <div className="px-4 py-2 bg-gray-800 text-center text-white font-semibold rounded-lg shadow-md">
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
          <button
            onClick={vote}
            className="w-72 px-4 py-2 bg-red-800 text-white font-semibold rounded-lg shadow-md
            hover:bg-red-700 active:scale-95 transition-transform duration-150 ease-out"
          >
            투표하기
          </button>
        )}
        <br></br>
      </div>
    )
  );
}
