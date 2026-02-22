/**
 * TERMINAL [01] 로고 컴포넌트
 *
 * T와 L이 확장되어 사각형 프레임을 형성하는 SVG 기반 로고.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`select-none ${className}`}>
      <svg
        viewBox="0 0 480 80"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[480px]"
        aria-label="TERMINAL"
      >
        {/* 사각형 프레임 (T의 상단 바 + L의 하단 바) */}
        <rect x="0" y="0" width="480" height="8" fill="#FF4500" />
        <rect x="0" y="72" width="480" height="8" fill="#FF4500" />
        <rect x="0" y="0" width="8" height="80" fill="#FF4500" />
        <rect x="472" y="0" width="8" height="80" fill="#FF4500" />

        {/* TERMINAL 텍스트 */}
        <text
          x="240"
          y="52"
          textAnchor="middle"
          fontFamily="'JetBrains Mono', monospace"
          fontWeight="700"
          fontSize="38"
          letterSpacing="12"
          fill="#C8C8C8"
        >
          TERMINAL
        </text>

        {/* [01] 배지 */}
        <text
          x="430"
          y="68"
          textAnchor="middle"
          fontFamily="'JetBrains Mono', monospace"
          fontWeight="400"
          fontSize="11"
          fill="#FF4500"
        >
          [01]
        </text>
      </svg>
    </div>
  );
}
