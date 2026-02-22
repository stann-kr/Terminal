"use client";

import { useEffect, useState } from "react";

/** 부팅 시퀀스에서 순차 출력될 텍스트 라인 목록 */
const BOOT_LINES = [
  { text: "TERMINAL [01] — SYSTEM BOOT INITIATED", delay: 0 },
  { text: "...", delay: 300 },
  { text: "[ OK ] Loading kernel modules...", delay: 700 },
  { text: "[ OK ] Mounting hyperdrive array...", delay: 1200 },
  { text: "[ OK ] Initializing navigation matrix...", delay: 1800 },
  { text: "[ OK ] Calibrating frequency bands...", delay: 2400 },
  { text: "[ -- ] Scanning for crew manifest...", delay: 3000 },
  { text: "[ OK ] Crew loaded: 3 personnel confirmed.", delay: 3600 },
  { text: "[ -- ] Verifying gate coordinates...", delay: 4200 },
  { text: "[ OK ] Gate: Club Faust, Seoul / 2026.03.07", delay: 4900 },
  { text: "...", delay: 5600 },
  { text: "──────────────────────────────────────────", delay: 6000 },
  { text: "  STATUS: OPERATIONAL", delay: 6400 },
  { text: "  Maiden Voyage to the Unknown Sector.", delay: 6900 },
  { text: "──────────────────────────────────────────", delay: 7300 },
];

interface BootSequenceProps {
  /** 부팅 완료 시 호출되는 콜백 */
  onComplete: () => void;
}

/**
 * CLI 스타일 부팅 시퀀스 컴포넌트.
 * 텍스트 라인을 순차적으로 출력한 뒤 onComplete를 호출합니다.
 */
export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    // 각 라인을 지정된 delay에 맞게 순차 출력
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((item, index) => {
      const t = setTimeout(() => {
        setVisibleCount(index + 1);
      }, item.delay);
      timers.push(t);
    });

    // 부팅 완료 후 터미널 진입
    const completeTimer = setTimeout(
      () => {
        onComplete();
      },
      BOOT_LINES[BOOT_LINES.length - 1].delay + 1500,
    );
    timers.push(completeTimer);

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // 특정 라인에 색상 적용
  const getLineStyle = (text: string): string => {
    if (text.includes("STATUS: OPERATIONAL"))
      return "text-[#ff4500] font-bold text-lg";
    if (text.includes("[ OK ]")) return "text-[#c8c8c8]";
    if (text.includes("[ -- ]")) return "text-[#8a8a8a]";
    if (text.includes("Maiden Voyage")) return "text-[#ff4500] italic";
    if (text.startsWith("──")) return "text-[#3a3a3a]";
    if (text === "...") return "text-[#6a6a6a]";
    return "text-[#c8c8c8]";
  };

  return (
    <div className="terminal-center screen-flicker">
      <div className="terminal-box space-y-1">
        {BOOT_LINES.slice(0, visibleCount).map((item, i) => (
          <p
            key={i}
            className={`font-mono text-sm leading-relaxed fade-in break-all ${getLineStyle(item.text)}`}
          >
            {item.text}
            {/* 마지막으로 출력된 라인에만 커서 표시 */}
            {i === visibleCount - 1 && <span className="cursor-blink" />}
          </p>
        ))}
      </div>
    </div>
  );
}
