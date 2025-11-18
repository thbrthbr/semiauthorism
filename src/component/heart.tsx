// ConfettiHeartArea.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, MouseEvent } from 'react';

type Heart = {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
  direction: number;
};

type Props = {
  children: React.ReactNode;
  className?: string;
  heartCount?: number; // 기본 여러 개
};

export default function ConfettiHeartArea({
  children,
  className,
  heartCount = 8,
}: Props) {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    // 짝수 클릭이면 무시
    if (nextCount % 2 === 0) return;

    const newHearts: Heart[] = Array.from({ length: heartCount }).map(() => {
      return {
        id: Date.now() + Math.random(),
        x,
        y,
        angle: Math.random() * 60 - 30, // -30 ~ +30도 회전
        scale: Math.random() * 0.6 + 0.7, // 0.7 ~ 1.3 크기
        direction: Math.random() > 0.5 ? 1 : -1, // 좌/우 퍼지는 방향
      };
    });

    setHearts((prev) => [...prev, ...newHearts]);
  };

  const removeHeart = (id: number) => {
    setHearts((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div
      onClick={handleClick}
      className={`relative inline-block ${className ?? ''}`}
    >
      {children}

      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <AnimatePresence>
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{
                opacity: 1,
                scale: heart.scale,
                x: heart.x,
                y: heart.y,
                rotate: 0,
              }}
              animate={{
                opacity: 0,
                y: heart.y - (80 + Math.random() * 40),
                x: heart.x + heart.direction * (40 + Math.random() * 40),
                rotate: heart.angle,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              onAnimationComplete={() => removeHeart(heart.id)}
              style={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* ♥ 대신 너가 쓰던 SVG로 교체해도 된다 */}
              <div className="text-pink-400 text-[22px] select-none">♥</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
