import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";

interface RainDrop {
  x0: number;
  y0: number;
  length: number;
  cycles: number; // Integer number of complete traversals across screen in 300 frames
  opacity: number;
  width: number;
  isRed: boolean;
}

interface DustMote {
  x0: number;
  y0: number;
  radius: number;
  ampX: number;
  ampY: number;
  phaseX: number;
  phaseY: number;
  cycles: number;
  baseOpacity: number;
  isRed: boolean;
}

/**
 * Atmospheric Effects:
 * 1. Subtle, slow-moving digital rain streaks (Blade Runner / Cyberpunk style).
 * 2. Ambient floating dust motes & nano-embers drifting gently across the viewport.
 * Mathematically constructed with exact harmonic integer frequencies so that
 * frame 0 and frame 300 match with absolute zero-jump seamless looping!
 */
export const AtmosphericEffects: React.FC = () => {
  const frame = useCurrentFrame();
  const totalFrames = 300;
  const loopProgress = (frame / totalFrames) * 2 * Math.PI;

  const virtualHeight = 1200; // -60px to 1140px
  const virtualWidth = 1920;

  // Generate deterministic rain particles
  const rainDrops: RainDrop[] = useMemo(() => {
    const drops: RainDrop[] = [];
    const count = 45; // Sparse, high-end subtle cyber drizzle
    for (let i = 0; i < count; i++) {
      // Deterministic pseudo-random distribution
      const seed1 = (i * 137.5) % 1;
      const seed2 = (i * 269.3) % 1;
      const seed3 = (i * 83.7) % 1;

      drops.push({
        x0: seed1 * virtualWidth,
        y0: seed2 * virtualHeight,
        length: 22 + seed3 * 28,
        cycles: 1 + (i % 3), // 1, 2, or 3 full vertical traversals per 10s loop
        opacity: 0.15 + seed3 * 0.25,
        width: seed3 > 0.8 ? 1.2 : 0.8,
        isRed: i % 4 === 0, // Occasional red neon rain streak
      });
    }
    return drops;
  }, []);

  // Generate deterministic floating dust motes
  const dustMotes: DustMote[] = useMemo(() => {
    const motes: DustMote[] = [];
    const count = 35; // Soft ambient dust motes
    for (let i = 0; i < count; i++) {
      const s1 = (i * 73.1) % 1;
      const s2 = (i * 191.7) % 1;
      const s3 = (i * 311.9) % 1;

      motes.push({
        x0: s1 * virtualWidth,
        y0: s2 * 1080,
        radius: 1 + s3 * 2,
        ampX: 18 + s1 * 26,
        ampY: 14 + s2 * 20,
        phaseX: s1 * Math.PI * 2,
        phaseY: s2 * Math.PI * 2,
        cycles: 1 + (i % 2),
        baseOpacity: 0.2 + s3 * 0.35,
        isRed: i % 3 === 0,
      });
    }
    return motes;
  }, []);

  // Rain slant angle: ~12 degrees
  const angleRad = (12 * Math.PI) / 180;
  const sinAngle = Math.sin(angleRad);
  const cosAngle = Math.cos(angleRad);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="mote-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Digital Rain Particles */}
        <g>
          {rainDrops.map((drop, i) => {
            // Calculate current y with exact modular loop
            const totalTravel = drop.cycles * virtualHeight;
            const currentY = -60 + ((drop.y0 + (totalTravel * frame) / totalFrames) % virtualHeight);
            const currentX = (drop.x0 + currentY * sinAngle) % virtualWidth;

            const dx = drop.length * sinAngle;
            const dy = drop.length * cosAngle;

            const strokeColor = drop.isRed
              ? `rgba(239, 68, 68, ${drop.opacity})`
              : `rgba(186, 230, 253, ${drop.opacity * 0.85})`;

            return (
              <line
                key={`rain-${i}`}
                x1={currentX}
                y1={currentY}
                x2={currentX + dx}
                y2={currentY + dy}
                stroke={strokeColor}
                strokeWidth={drop.width}
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* Ambient Floating Dust Motes / Nano-Embers */}
        <g filter="url(#mote-glow)">
          {dustMotes.map((mote, i) => {
            const freq = mote.cycles;
            const currentX =
              mote.x0 + Math.sin(loopProgress * freq + mote.phaseX) * mote.ampX;
            const currentY =
              mote.y0 + Math.cos(loopProgress * freq + mote.phaseY) * mote.ampY;
            const currentOpacity =
              mote.baseOpacity +
              Math.sin(loopProgress * freq + mote.phaseX) * 0.15;

            const fill = mote.isRed
              ? "rgba(248, 113, 113, 0.9)"
              : "rgba(186, 230, 253, 0.85)";

            return (
              <circle
                key={`mote-${i}`}
                cx={currentX}
                cy={currentY}
                r={mote.radius}
                fill={fill}
                opacity={Math.max(0.08, currentOpacity)}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};
