interface FetusSVGProps {
  week?: number;
  color?: string;
  size?: number;
}

export function FetusSVG({ week = 11, color = "#E8D5C5", size = 90 }: FetusSVGProps) {
  const t = Math.min(Math.max((week - 4) / 36, 0), 1);
  const scale = 0.35 + t * 0.75;
  const headR = 12 + t * 5;
  const bodyLen = 14 + t * 18;

  return (
    <svg
      width={size}
      height={size}
      viewBox="-50 -50 100 100"
      style={{ transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)" }}
    >
      <ellipse cx="0" cy="0" rx="38" ry="42" fill="rgba(245,227,226,0.15)" />
      <ellipse cx="0" cy="0" rx="34" ry="38" fill="rgba(245,227,226,0.08)" />
      <g transform={`scale(${scale}) translate(0, ${-bodyLen * 0.1})`}>
        <path
          d={`M 0,${-headR * 0.4}
              C ${headR * 0.8},${-headR * 0.4} ${headR * 0.9},${bodyLen * 0.2} ${headR * 0.5},${bodyLen * 0.5}
              C ${headR * 0.2},${bodyLen * 0.8} ${-headR * 0.2},${bodyLen * 0.8} ${-headR * 0.5},${bodyLen * 0.5}
              C ${-headR * 0.9},${bodyLen * 0.2} ${-headR * 0.8},${-headR * 0.4} 0,${-headR * 0.4} Z`}
          fill={color}
          opacity="0.95"
        />
        <circle cx="0" cy={-headR * 0.4} r={headR} fill={color} />
        {week >= 8 && (
          <path
            d={`M ${headR * 0.5},${bodyLen * 0.2} Q ${headR * 1.2},${bodyLen * 0.4} ${headR * 0.8},${bodyLen * 0.55}`}
            stroke={color}
            strokeWidth={headR * 0.3}
            strokeLinecap="round"
            fill="none"
          />
        )}
        {week >= 12 && (
          <path
            d={`M ${-headR * 0.2},${bodyLen * 0.6} Q ${-headR * 0.1},${bodyLen * 0.9} ${headR * 0.1},${bodyLen * 0.85}`}
            stroke={color}
            strokeWidth={headR * 0.35}
            strokeLinecap="round"
            fill="none"
          />
        )}
        {week >= 10 && (
          <circle cx={-headR * 0.3} cy={-headR * 0.5} r={headR * 0.1} fill="rgba(0,0,0,0.3)" />
        )}
      </g>
    </svg>
  );
}

export default FetusSVG;
