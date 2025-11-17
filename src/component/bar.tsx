import React from 'react';
import { motion } from 'framer-motion';

/**
 * PercentBar (TS 총합 버전)
 * 퍼센트에 따라 색/길이/라벨/애니메이션이 달라지는 막대 컴포넌트
 *
 * Props:
 * - value: number (0~100)
 * - showLabel?: boolean (default true)
 * - height?: number (px, default 14)
 * - rounded?: boolean (default true)
 * - animate?: boolean (default true)
 * - striped?: boolean (default false)
 * - thresholds?: { good: number; warn: number } (default { good: 70, warn: 30 })
 * - colorMode?: "status" | "brand" (default "status")
 * - className?: string (container)
 */
export type PercentBarProps = {
  value: number;
  showLabel?: boolean;
  height?: number;
  rounded?: boolean;
  animate?: boolean;
  striped?: boolean;
  thresholds?: { good: number; warn: number };
  colorMode?: 'status' | 'brand';
  className?: string;
};

export const PercentBar: React.FC<PercentBarProps> = ({
  value,
  showLabel = true,
  height = 14,
  rounded = true,
  animate = true,
  striped = false,
  thresholds = { good: 70, warn: 30 },
  colorMode = 'status',
  className = '',
}) => {
  const v = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));

  const barColor = (() => {
    if (colorMode === 'brand') return 'bg-blue-500';
    if (v >= thresholds.good) return 'bg-emerald-500';
    if (v >= thresholds.warn) return 'bg-amber-500';
    return 'bg-rose-500';
  })();

  const radius = rounded ? 'rounded-full' : 'rounded';
  const stripeClass = striped
    ? 'bg-[length:20px_20px] bg-[linear-gradient(45deg,rgba(255,255,255,.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.25)_50%,rgba(255,255,255,.25)_75%,transparent_75%,transparent)]'
    : '';

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative w-full bg-gray-200/70 dark:bg-gray-800/60 ${radius} overflow-hidden`}
        style={{ height }}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={v}
        role="progressbar"
      >
        {animate ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${v}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className={`h-full ${barColor} ${radius} ${stripeClass}`}
          />
        ) : (
          <div
            className={`h-full ${barColor} ${radius} ${stripeClass}`}
            style={{ width: `${v}%` }}
          />
        )}

        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center text-[11px] font-medium text-white/95 drop-shadow">
            {v.toFixed(0)}%
          </div>
        )}
      </div>
    </div>
  );
};

// =====================
// Preview / Demo (TSX)
// =====================

// children 타입 누락 오류 방지를 위해 PropsWithChildren 사용

type DemoRowProps = React.PropsWithChildren<{
  title: string;
}>;

const DemoRow = ({ title, children }: DemoRowProps) => (
  <div className="space-y-1">
    <div className="text-xs text-gray-500 dark:text-gray-400">{title}</div>
    {children}
  </div>
);

export default function Preview() {
  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 p-6 md:p-10 flex items-start justify-center">
      <div className="w-full max-w-xl space-y-6">
        <h1 className="text-2xl font-semibold">PercentBar Examples</h1>

        <DemoRow title="기본 (status 색상 자동)">
          <PercentBar value={72} />
        </DemoRow>

        <DemoRow title="라벨 숨김 + 얕은 모서리">
          <PercentBar value={18} showLabel={false} rounded={false} />
        </DemoRow>

        <DemoRow title="높이 24px + 스트라이프 + 애니메이션">
          <PercentBar value={45} height={24} striped animate />
        </DemoRow>

        <DemoRow title="브랜드 단일색 (blue)">
          <PercentBar value={86} colorMode="brand" />
        </DemoRow>

        <DemoRow title="커스텀 임계값 (good: 85, warn: 50)">
          <PercentBar value={60} thresholds={{ good: 85, warn: 50 }} />
        </DemoRow>

        <DemoRow title="0, 100 경계값 클램프">
          <div className="space-y-2">
            <PercentBar value={-10} />
            <PercentBar value={110} />
          </div>
        </DemoRow>
      </div>
    </div>
  );
}
