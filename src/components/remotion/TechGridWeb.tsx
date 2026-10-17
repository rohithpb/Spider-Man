import React from "react";
import { useCurrentFrame } from "remotion";

/**
 * Left Side: Clean, minimal tech grid & geometric cyber web lines.
 * Provides ample negative space for website UI while maintaining
 * the Spider-Man cybernetic Brand New Day aesthetic.
 */
export const TechGridWeb: React.FC = () => {
  const frame = useCurrentFrame();
  const totalFrames = 300;
  const loopProgress = (frame / totalFrames) * 2 * Math.PI;

  // Gentle rhythmic pulse (loops seamlessly)
  const pulse = 0.75 + 0.25 * Math.sin(loopProgress);
  const gridShift = Math.sin(loopProgress) * 8;

  // Geometric web lines radiating from upper-left corner
  const webOriginX = 160;
  const webOriginY = 120;

  const radialRays = [
    { angle: 15, length: 1100 },
    { angle: 32, length: 1250 },
    { angle: 48, length: 1300 },
    { angle: 65, length: 1150 },
    { angle: 80, length: 980 },
  ];

  const concentricRings = [140, 260, 400, 560, 740, 940];

  // Tech nodes at intersections
  const nodes = [
    { x: 300, y: 220, size: 2.5, phase: 0 },
    { x: 480, y: 340, size: 2, phase: 1.2 },
    { x: 220, y: 460, size: 2.2, phase: 2.4 },
    { x: 620, y: 280, size: 1.8, phase: 3.1 },
    { x: 420, y: 580, size: 2.5, phase: 4.0 },
    { x: 180, y: 720, size: 2, phase: 5.2 },
    { x: 520, y: 740, size: 2.2, phase: 0.8 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "60%",
        height: "100%",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1152 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          opacity: 0.85,
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)",
        }}
      >
        <defs>
          <pattern
            id="subtle-tech-grid"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(0, ${gridShift})`}
          >
            <path
              d="M 64 0 L 0 0 0 64"
              fill="none"
              stroke="rgba(56, 189, 248, 0.035)"
              strokeWidth="0.75"
            />
            <circle cx="64" cy="64" r="0.75" fill="rgba(56, 189, 248, 0.08)" />
          </pattern>

          {/* Glowing node filter */}
          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Subtle Tech Grid Base */}
        <rect width="100%" height="100%" fill="url(#subtle-tech-grid)" />

        {/* Geometric Web Lines - Radial Strands */}
        <g stroke="rgba(226, 54, 54, 0.08)" strokeWidth="0.85">
          {radialRays.map((ray, i) => {
            const rad = (ray.angle * Math.PI) / 180;
            const endX = webOriginX + Math.cos(rad) * ray.length;
            const endY = webOriginY + Math.sin(rad) * ray.length;
            return (
              <line
                key={`ray-${i}`}
                x1={webOriginX}
                y1={webOriginY}
                x2={endX}
                y2={endY}
                stroke={i % 2 === 0 ? "rgba(226, 54, 54, 0.09)" : "rgba(56, 189, 248, 0.06)"}
                strokeDasharray={i % 3 === 0 ? "4 8" : undefined}
              />
            );
          })}
        </g>

        {/* Geometric Web Lines - Concentric Arcs */}
        <g fill="none" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="0.75">
          {concentricRings.map((r, i) => (
            <path
              key={`ring-${i}`}
              d={`M ${webOriginX + r * Math.cos((10 * Math.PI) / 180)} ${
                webOriginY + r * Math.sin((10 * Math.PI) / 180)
              } A ${r} ${r} 0 0 1 ${
                webOriginX + r * Math.cos((85 * Math.PI) / 180)
              } ${webOriginY + r * Math.sin((85 * Math.PI) / 180)}`}
              stroke={i === 2 ? "rgba(226, 54, 54, 0.1)" : "rgba(56, 189, 248, 0.05)"}
            />
          ))}
        </g>

        {/* Subtle Circuit Interconnect Lines */}
        <path
          d="M 100 280 L 260 280 L 320 340 L 480 340 L 520 380 L 700 380"
          fill="none"
          stroke="rgba(226, 54, 54, 0.06)"
          strokeWidth="1"
          strokeDasharray="6 6"
        />
        <path
          d="M 80 500 L 220 500 L 280 560 L 440 560 L 500 620"
          fill="none"
          stroke="rgba(56, 189, 248, 0.045)"
          strokeWidth="0.8"
        />

        {/* Tech Nodes with Micro Glows */}
        {nodes.map((node, i) => {
          const nodePulse = 0.5 + 0.5 * Math.sin(loopProgress + node.phase);
          const isRed = i % 2 === 0;
          return (
            <g key={`node-${i}`} transform={`translate(${node.x}, ${node.y})`}>
              {/* Outer halo */}
              <circle
                r={node.size * 3}
                fill={isRed ? "rgba(239, 68, 68, 0.08)" : "rgba(56, 189, 248, 0.08)"}
                opacity={nodePulse}
              />
              {/* Core point */}
              <circle
                r={node.size}
                fill={isRed ? "rgba(248, 113, 113, 0.85)" : "rgba(125, 211, 252, 0.85)"}
                filter="url(#node-glow)"
                opacity={0.4 + nodePulse * 0.6}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
