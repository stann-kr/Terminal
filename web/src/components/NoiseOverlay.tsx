"use client";

import { useEffect, useRef } from "react";

/**
 * NoiseOverlay Component
 * Canvas API를 사용하여 실시간으로 랜덤 픽셀 노이즈(Grain)를 생성합니다.
 * CSS 애니메이션 방식보다 더욱 진본에 가까운 레트로 질감을 제공합니다.
 */
export default function NoiseOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // 윈도우 크기에 맞춰 캔버스 해상도 조정 (입체감을 위해 해상도를 낮춤)
    const resize = () => {
      const scale = 0.33; // 해상도를 1/3로 낮춰 Grain 크기를 3배로 키움
      canvas.width = window.innerWidth * scale;
      canvas.height = window.innerHeight * scale;
    };

    window.addEventListener("resize", resize);
    resize();

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      if (w === 0 || h === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const idata = ctx.createImageData(w, h);
      const buffer32 = new Uint32Array(idata.data.buffer);

      for (let i = 0; i < buffer32.length; i++) {
        // 무작위 픽셀 생성 (Alpha 값을 높여 더 밝게 처리)
        // 0x30ffffff: Alpha=48 (기존 대비 약 2배 밝기)
        if (Math.random() < 0.06) {
          buffer32[i] = 0x30ffffff;
        }
      }

      ctx.putImageData(idata, 0, 0);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full opacity-10 pointer-events-none z-[10000]"
      style={{
        mixBlendMode: "screen",
        imageRendering: "pixelated",
      }}
    />
  );
}
