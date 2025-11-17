import defaultImg from '../asset/no-image.png';

export default function Imag({ source }: any) {
  return <img src={source == 'no-image' ? defaultImg.src : source} />;
}
