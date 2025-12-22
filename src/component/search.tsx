import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Search() {
  const searchRef = useRef<any>(null);
  const router = useRouter();
  const [searched, setSearched] = useState<boolean>(false);
  const [polls, setPolls] = useState<any>([]);

  const search = async (text: string) => {
    const res = await fetch(`/api/search`, {
      method: 'POST',
      body: JSON.stringify({
        searchOption: text,
        type: 'title',
      }),
      cache: 'no-store',
    });

    const final = await res.json();
    if (final.message === '검색완료') {
      setSearched(true);
      setPolls(final.data);
    }
  };

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  return (
    <div className="w-full p-6 text-black">
      <div className="w-full flex">
        <input
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              search(searchRef.current.value);
            }
          }}
          ref={searchRef}
          placeholder="검색할 키워드를 적어보세요"
          className="pl-2 rounded-md w-[85%] h-12 border border-2 border-black focus:outline-none"
        ></input>
        <button
          onClick={() => {
            search(searchRef.current.value);
          }}
          className="ism bg-black w-[15%] text-white rounded-md border border-2 border-black active:scale-95 transition-transform duration-150 ease-out"
        >
          검색
        </button>
      </div>

      {searched === true ? (
        <div className="rounded-md w-[85%] border border-2 border-black bg-white max-h-96 overflow-auto">
          {polls.length > 0 ? (
            polls.map((poll: any) => {
              return (
                <button
                  key={poll.id}
                  className="w-full"
                  onClick={() => {
                    router.push(`/poll/${poll.publicId}`);
                  }}
                >
                  <div className="flex w-full items-between justify-between px-1">
                    <div className="truncate w-[70%]">{poll.title}</div>
                    <div className="text-end truncate w-[30%]">
                      {JSON.parse(poll.categories).reduce(
                        (acc: number, cur: any) => acc + cur.percentage,
                        0,
                      )}
                      표
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="w-full">
              <div className="flex w-full items-between justify-between px-1">
                해당결과가 없습니다
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
