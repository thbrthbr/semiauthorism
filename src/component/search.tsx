import { useRef, useState } from 'react';

export default function Search() {
  const searchRef = useRef<any>(null);
  const [searched, setSearched] = useState<boolean>(false);
  const [polls, setPolls] = useState<any>([]);

  const search = async (text: string) => {
    if (!text) return [];
    const chars = [...text];
    const ngrams = new Set<string>();
    chars.forEach((c) => ngrams.add(c));
    for (let i = 0; i < chars.length - 1; i++) {
      ngrams.add(chars[i] + chars[i + 1]);
    }
    ngrams.add(text);
    const arr = Array.from(ngrams);
    console.log(arr);
    const res = await fetch(`/api/search`, {
      method: 'POST',
      body: JSON.stringify({
        searchOption: arr,
        type: 'title',
      }),
      cache: 'no-store',
    });

    const final = await res.json();
  };

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
      {searched && (
        <div className="w-full bg-white max-h-96 overflow-auto"></div>
      )}
    </div>
  );
}
