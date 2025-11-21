'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Spinner from '@/component/spinner';
import Imag from '@/component/image';
import { PercentBar } from '@/component/bar';

export default function Result() {
  const param = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  const getPoll = async () => {
    const result = await fetch(`/api/poll/${param.id}`, {
      method: 'GET',
      cache: 'no-store',
    });
    const final = await result.json();
    let itemArr = JSON.parse(final?.data[0]?.categories);
    const real = itemArr.reduce((acc: any, cur: any) => {
      const votes = cur.percentage;
      return acc + votes;
    }, 0);
    let pollData = final?.data[0];
    pollData.poll = itemArr;
    pollData.total = real;
    setData(pollData);
  };

  useEffect(() => {
    getPoll();
  }, []);
  return (
    <div className="p-8 w-full flex jutify-center items-center flex-col text-white">
      {data ? (
        <>
          <div
            onContextMenu={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className="text-5xl w-full justify-center flex ism italic"
          >
            {data.title}
          </div>
          <details className="pt-4 w-72 ism flex justify-center flex-col items-center">
            <summary className="text-xs cursor-pointer">투표설명보기</summary>
            <div className="pt-4 whitespace-pre-wrap">{data.desc}</div>
          </details>
          {data.poll.map((item: any) => {
            const eachPer =
              data.total === 0
                ? 0
                : Math.round((item.percentage / data.total) * 100);
            return (
              <div key={item.id}>
                <div
                  key={item.id}
                  className={`overflow-hidden rounded-lg mt-4 w-72 flex flex-col items-center border-4 border-black`}
                >
                  <Imag source={item.img} type="full" />
                  <div className="bg-black w-full py-4 space-y-2 flex justify-center flex-col items-center">
                    <div className="text-4xl pdh">{item.title}</div>
                    <div className="text-[13px] ism">{item.desc}</div>
                    <div className="text-[13px] ism">{item.percentage}표</div>
                    <PercentBar value={eachPer} />
                  </div>
                </div>
              </div>
            );
          })}
          <br></br>
          <button
            className="w-72 px-4 py-2 bg-red-800 text-white font-semibold rounded-lg shadow-md
        hover:bg-red-700 active:scale-95 transition-transform duration-150 ease-out"
            onClick={() => {
              router.back();
            }}
          >
            투표로 돌아가기
          </button>
          <br></br>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
