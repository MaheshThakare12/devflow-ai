import React from 'react';

export function ProgressRing({ radius, stroke, progress, color }: { radius: number, stroke: number, progress: number, color: string }) {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
        <circle
          stroke="rgba(255,255,255,0.1)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-out' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute font-bold text-xl">{Math.round(progress)}%</div>
    </div>
  );
}
