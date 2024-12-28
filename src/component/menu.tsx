interface Props {
  location: Location
  customFunctions: any
}

interface Location {
  x: number
  y: number
}

export default function Menu({ location, customFunctions }: Props) {
  const { x, y } = location

  return (
    <div
      className="border p-2 rounded-md z-[9999] bg-white text-black absolute flex flex-col gap-2 w-[200px]"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <div>
        <button onClick={customFunctions?.addText}>txt파일 추가</button>
      </div>
      <div>
        <button>폴더 추가</button>
      </div>
    </div>
  )
}
