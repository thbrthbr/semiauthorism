import { useState } from 'react';
import defaultImg from '../asset/no-image.png';
import Spinner from './spinner';

export default function Imag({ source, type }: any) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const finalSrc = error || source === 'no-image' ? defaultImg.src : source;

  return (
    <div className="w-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Spinner />
        </div>
      )}
      <img
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        className={`${type === 'full' ? 'w-full' : 'w-24 h-24'} aspect-square object-contain`}
        src={finalSrc}
        // style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.2s' }}
      />
    </div>
  );
}
