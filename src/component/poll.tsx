import { useEffect, useState } from 'react';
import Imag from './image';
import { useRouter } from 'next/navigation';

export default function Poll({ data }: any) {
  const [selected, setSelected] = useState<any>([]);
  const [voted, setVoted] = useState<boolean>(false);
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

  const vote = async () => {
    const temp = [...selected];
    if (
      localStorage.getItem(
        '공정한 투표를 위해 조작행위는 삼가부탁드려요!! ㅠㅠ',
      )
    ) {
      alert('이미 투표하셨습니다!');
      return;
    } else {
      localStorage.setItem(
        '공정한 투표를 위해 조작행위는 삼가부탁드려요!! ㅠㅠ',
        'true',
      );
      const res = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/vote`, {
        method: 'POST',
        body: JSON.stringify({
          id: data.id,
          vote: temp,
        }),
        cache: 'no-store',
      });
      alert('투표완료! 가까운 시일 내 결과가 공개됩니다!');
      router.push(`/result/${data.publicId}`);
    }
  };

  useEffect(() => {
    if (
      localStorage.getItem(
        '공정한 투표를 위해 조작행위는 삼가부탁드려요!! ㅠㅠ',
      )
    ) {
      setVoted(true);
    }
  }, [voted]);

  return (
    data && (
      <div className="m-8 justify-center flex flex-col">
        <div className="text-sm w-full justify-center flex">{data.title}</div>
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
              <div className="text-2xl">{item.title}</div>
              <div>{item.desc}</div>
              {/* <div>{item.percentage}표</div> */}
            </button>
          );
        })}
        <br></br>
        {voted ? (
          <div className="px-4 py-2 bg-gray-800 text-center text-white font-semibold rounded-lg shadow-md">
            투표완료
          </div>
        ) : (
          <button
            onClick={vote}
            className="px-4 py-2 bg-red-800 text-white font-semibold rounded-lg shadow-md
        hover:bg-red-700 active:scale-95 transition-transform duration-150 ease-out"
          >
            투표하기
          </button>
        )}
      </div>
    )
  );
}
