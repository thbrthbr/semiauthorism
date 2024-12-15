interface Props {
  location: Location
}

interface Location {
  x: number
  y: number
}

export default function Menu({ location }: Props) {
  const { x, y } = location
  return (
    <div
      style={{
        width: '200px',

        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        color: 'black',
        backgroundColor: 'white',
        zIndex: 9999,
        borderRadius: '6px',
        padding: '8px',
      }}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <button>폴더 추가</button>
    </div>
  )
}
