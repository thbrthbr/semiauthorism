import defaultImg from '../asset/no-image.png';

export default function Imag({ source, type }: any) {
  console.log(source);
  return (
    <img
      className={`${type === 'full' ? 'w-full' : 'w-24 h-24'} aspect-square object-contain`}
      src={source == 'no-image' ? defaultImg.src : source}
    />
  );
}
