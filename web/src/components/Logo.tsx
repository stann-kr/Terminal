/**
 * TERMINAL [01] 로고 컴포넌트
 *
 * T와 L이 확장되어 사각형 프레임을 형성하는 SVG 기반 로고.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`select-none ${className}`}>
      <svg
        viewBox="0 0 640 80"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[640px]"
        aria-label="TERMINAL"
      >
        {/* 사각형 프레임 (T의 상단 바 + L의 하단 바) */}
        <rect x="0" y="0" width="640" height="8" fill="var(--orange)" />
        <rect x="0" y="72" width="640" height="8" fill="var(--orange)" />
        <rect x="0" y="0" width="8" height="80" fill="var(--orange)" />
        <rect x="632" y="0" width="8" height="80" fill="var(--orange)" />

        {/* TERMINAL 텍스트 */}
        <text
          x="320"
          y="52"
          textAnchor="middle"
          fontWeight="700"
          fontSize="38"
          letterSpacing="12"
          fill="var(--grey-text)"
          style={{ fontFamily: "var(--font-logo)" }}
        >
          TERMINAL
        </text>
      </svg>
    </div>
  );
}
