import { useRouter } from 'next/navigation'

export default function Polls({ datas, pod }: any) {
  const router = useRouter()
  return (
    <div className="relative w-72 m-8 justify-center items-center flex flex-col">
      {datas.map((data: any) => {
        if (data.id == pod.id) {
          return
        }
        return (
          <button
            className="w-full flex p-1 border border-2 border-white/20 my-1 rounded-md"
            key={data.id}
            onClick={() => {
              router.push(`/poll/${data.publicId}`)
            }}
          >
            <div className="flex w-full items-between justify-between px-1">
              <div className="text-start truncate w-[70%]">{data.title}</div>
              <div className="text-end truncate w-[30%]">{data.nick}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
