'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Spinner from '@/component/spinner';
import Imag from '@/component/image';
import { PercentBar } from '@/component/bar';
import First from '@/asset/first.png';
import Second from '@/asset/second.png';
import Third from '@/asset/third.png';
import None from '@/asset/none.png';
import Polls from '@/component/polls';
import { MdOutlineEdit } from 'react-icons/md';

export default function Result() {
  const param = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [polls, setPolls] = useState<any>([]);
  const [pod, setPod] = useState<any>(null);
  const [showPolls, setShowPolls] = useState<boolean>(false);

  const getPoll = async () => {
    const result = await fetch(`/api/poll/${param.id}`, {
      method: 'GET',
      cache: 'no-store',
    });
    const final = await result.json();
    const res = await fetch(`/api/main`, {
      method: 'GET',
      cache: 'no-store',
    });
    const final2 = await res.json();
    const pollRaw = final?.data?.[0];
    if (!pollRaw) return;

    let itemArr = JSON.parse(pollRaw.categories || '[]');
    const totalVotes = itemArr.reduce(
      (sum: number, cur: any) => sum + Number(cur.percentage),
      0,
    );

    const withPercent = itemArr.map((item: any) => {
      const raw =
        totalVotes === 0 ? 0 : (Number(item.percentage) / totalVotes) * 100;

      return {
        ...item,
        eachPer: raw, // 숫자로 저장
      };
    });

    const sorted = withPercent.sort(
      (a: any, b: any) => b.percentage - a.percentage,
    );

    let rank = 1;
    let lastPer: number | null = null;
    let sameRankCount = 0;

    const ranked = sorted.map((item: any) => {
      const current = Number(item.eachPer);
      if (lastPer === null) {
        lastPer = current;
        return { ...item, rank };
      }
      if (current === lastPer) {
        sameRankCount++;
        return { ...item, rank };
      } else {
        rank += sameRankCount + 1;
        sameRankCount = 0;
        lastPer = current;
        return { ...item, rank };
      }
    });
    setPolls(
      final2.data.polls.map((item: any, i: number) => {
        return { ...item, categories: JSON.parse(item.categories) };
      }),
    );
    setPod({ id: pollRaw.id });
    setData({
      ...pollRaw,
      poll: ranked,
      total: totalVotes,
    });
  };

  useEffect(() => {
    getPoll();
  }, []);

  // 메달 매칭
  const getMedal = (rank: number) => {
    if (rank === 1) return First.src;
    if (rank === 2) return Second.src;
    if (rank === 3) return Third.src;
    return None.src;
  };

  const editHandler = async () => {
    const prompt = window.prompt('비밀번호를 입력하세요');
    const res = await fetch(`/api/pw`, {
      method: 'POST',
      body: JSON.stringify({
        pw: prompt,
        id: data.id,
        type: 'user',
      }),
      cache: 'no-store',
    });
    const final = await res.json();
    if (final.message == 'OK') {
      router.push(`/poll-edit/${data.id}`);
    }
  };

  return (
    <div className="p-8 w-full flex justify-center items-center flex-col text-white">
      {data ? (
        <>
          <div
            onContextMenu={(e) => e.preventDefault()}
            className="text-5xl w-full justify-center flex ism italic"
          >
            {data.title}
          </div>

          <details className="pt-4 w-72 ism flex justify-center flex-col items-center">
            <summary className="text-xs cursor-pointer">투표설명보기</summary>
            <div className="pt-4 whitespace-pre-wrap">{data.desc}</div>
          </details>

          {data.poll.map((item: any) => {
            const src = getMedal(item.rank);
            return (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-lg mt-4 w-72 flex flex-col items-center border-4 border-black"
              >
                <img
                  src={src}
                  alt={`${item.rank}등`}
                  className="absolute w-20 h-20 top-2 left-0 z-10"
                />
                <Imag source={item.img} type="full" />
                <div className="bg-black w-full py-4 space-y-2 flex justify-center flex-col items-center">
                  <div className="text-4xl pdh">{item.title}</div>
                  <div className="text-[13px] ism">{item.desc}</div>
                  <div className="text-[13px] ism">{item.percentage}표</div>
                  <PercentBar value={item.eachPer} />
                </div>
              </div>
            );
          })}

          <br />
          {Date.now() >= Number(data.publicId) + Number(data.end) * 60000 ? (
            <div className="w-72 px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md ">
              투표마감
            </div>
          ) : (
            <button
              className="w-72 px-4 py-2 bg-red-800 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 active:scale-95 transition-transform duration-150 ease-out"
              onClick={() => router.push(`/poll/${data.publicId}`)}
            >
              투표로 돌아가기
            </button>
          )}

          <br></br>
          <button
            onClick={() => {
              setShowPolls(!showPolls);
            }}
            className="w-72 px-4 py-2 bg-white text-black font-semibold rounded-lg shadow-md
                    hover:bg-gray-200 active:scale-95 transition-transform duration-150 ease-out"
          >
            {showPolls ? '접기' : '다른 투표들 보기'}
          </button>
          {showPolls && <Polls datas={polls} pod={pod} />}
          <div className="w-72 flex justify-end pt-2 ism">
            <button
              className="flex justify-center items-center"
              onClick={editHandler}
            >
              <div>투표수정</div>
              <MdOutlineEdit />
            </button>
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
