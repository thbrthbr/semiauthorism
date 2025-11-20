import { useRouter } from 'next/navigation';

export default function Polls({ datas, pod }: any) {
  const router = useRouter();
  return (
    <div className="relative w-72 m-8 justify-center items-center flex flex-col">
      {datas.map((data: any) => {
        if (data.id == pod.id) {
          return;
        }
        return (
          <button
            className="w-full flex p-1 border border-2 border-white/20 my-1 rounded-md"
            key={data.id}
            onClick={() => {
              router.push(`/poll/${data.publicId}`);
            }}
          >
            {data.title}
          </button>
        );
      })}
    </div>
  );
}
