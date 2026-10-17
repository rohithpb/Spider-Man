import React from "react";
import { useCurrentFrame } from "remotion";

/**
 * Right Side: Stylized silhouette of towering cyberpunk skyscrapers
 * with dim glowing crimson accent lights, skyscraper windows, and
 * pulsing antenna warning beacons hinting at a distant futuristic NYC skyline.
 */
export const CyberpunkCityscape: React.FC = () => {
  const frame = useCurrentFrame();
  const totalFrames = 300;
  const loopProgress = (frame / totalFrames) * 2 * Math.PI;

  // Slow subtle city parallax sway (loops seamlessly)
  const citySwayFar = Math.sin(loopProgress) * 6;
  const citySwayNear = Math.sin(loopProgress) * 12;

  // Beacon flash and ambient neon breathing
  const beaconGlow = Math.pow(Math.max(0, Math.sin(loopProgress * 2)), 3);
  const neonBreath = 0.7 + 0.3 * Math.sin(loopProgress);

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        bottom: 0,
        width: "65%",
        height: "100%",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1248 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMax meet"
        style={{
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 15%, rgba(0,0,0,1) 40%)",
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 15%, rgba(0,0,0,1) 40%)",
        }}
      >
        <defs>
          {/* Volumetric Crimson Ambient Horizon Glow */}
          <radialGradient
            id="skyline-crimson-glow"
            cx="75%"
            cy="65%"
            r="60%"
            fx="75%"
            fy="65%"
          >
            <stop offset="0%" stopColor="rgba(226, 54, 54, 0.28)" />
            <stop offset="40%" stopColor="rgba(153, 27, 27, 0.14)" />
            <stop offset="80%" stopColor="rgba(15, 23, 42, 0.05)" />
            <stop offset="100%" stopColor="rgba(4, 7, 17, 0)" />
          </radialGradient>

          {/* Vertical Architectural Red Neon Gradient */}
          <linearGradient id="neon-strip-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 90, 90, 0.95)" />
            <stop offset="70%" stopColor="rgba(226, 54, 54, 0.6)" />
            <stop offset="100%" stopColor="rgba(153, 27, 27, 0.1)" />
          </linearGradient>

          {/* Window Glow Filter */}
          <filter id="beacon-filter" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Sky Horizon Glow Behind Towers */}
        <rect
          x="100"
          y="200"
          width="1148"
          height="880"
          fill="url(#skyline-crimson-glow)"
          opacity={neonBreath}
        />

        {/* ========================================================
            LAYER 1: Distant Skyline Silhouette (Far Background)
           ======================================================== */}
        <g
          transform={`translate(${citySwayFar}, 0)`}
          fill="#030612"
          opacity="0.8"
        >
          {/* Tower 1 */}
          <rect x="240" y="520" width="70" height="560" />
          <polygon points="240,520 275,480 310,520" />
          <line x1="275" y1="480" x2="275" y2="440" stroke="#081028" strokeWidth="2" />

          {/* Tower 2 */}
          <rect x="340" y="440" width="90" height="640" />
          <line x1="385" y1="440" x2="385" y2="390" stroke="#081028" strokeWidth="2.5" />

          {/* Tower 3 */}
          <rect x="470" y="560" width="80" height="520" />

          {/* Tower 4 (Empire-scale Spire) */}
          <rect x="580" y="380" width="100" height="700" />
          <rect x="610" y="310" width="40" height="70" />
          <line x1="630" y1="310" x2="630" y2="230" stroke="#081028" strokeWidth="3" />

          {/* Tower 5 */}
          <rect x="710" y="490" width="85" height="590" />
          <polygon points="710,490 752,430 795,490" />

          {/* Tower 6 */}
          <rect x="830" y="410" width="110" height="670" />
          <line x1="885" y1="410" x2="885" y2="340" stroke="#081028" strokeWidth="2" />

          {/* Tower 7 */}
          <rect x="970" y="510" width="90" height="570" />
          <rect x="1090" y="460" width="120" height="620" />
        </g>

        {/* Distant Spire Beacons (Dim red blinks) */}
        <g opacity={beaconGlow * 0.7} filter="url(#beacon-filter)">
          <circle cx="275" cy="440" r="2.5" fill="#ff4d4d" />
          <circle cx="385" cy="390" r="3" fill="#ff4d4d" />
          <circle cx="630" cy="230" r="3.5" fill="#ff2222" />
          <circle cx="885" cy="340" r="3" fill="#ff4d4d" />
        </g>

        {/* ========================================================
            LAYER 2: Midground Skyscrapers (Rich architectural detail)
           ======================================================== */}
        <g
          transform={`translate(${citySwayNear * 0.6}, 0)`}
          fill="#050a1b"
        >
          {/* Cyber Megatower Left */}
          <path d="M 380 620 L 440 550 L 500 550 L 500 1080 L 380 1080 Z" />
          <line x1="440" y1="550" x2="440" y2="480" stroke="#0b1536" strokeWidth="2.5" />

          {/* Slanted Blade Skyscraper */}
          <polygon points="530,1080 530,480 630,410 650,410 650,1080" />
          
          {/* Angular Crown High-rise */}
          <polygon points="690,1080 690,520 740,470 790,520 790,1080" />
          <line x1="740" y1="470" x2="740" y2="390" stroke="#0f1f4d" strokeWidth="3" />

          {/* Oscorp-style Twin Apex */}
          <path d="M 830 1080 L 830 460 L 870 420 L 890 420 L 890 450 L 920 420 L 940 420 L 980 460 L 980 1080 Z" />

          {/* Broad Mega-block */}
          <rect x="1010" y="510" width="160" height="570" />
          <polygon points="1010,510 1090,470 1170,510" />
        </g>

        {/* Vertical Red Neon Edge Lighting on Midground Towers */}
        <g opacity={neonBreath}>
          {/* Slanted Blade Roof Neon Strip */}
          <line
            x1="531"
            y1="480"
            x2="630"
            y2="410"
            stroke="url(#neon-strip-grad)"
            strokeWidth="2"
            filter="url(#beacon-filter)"
          />
          {/* Architectural Vertical Neon Lines */}
          <line
            x1="650"
            y1="430"
            x2="650"
            y2="820"
            stroke="url(#neon-strip-grad)"
            strokeWidth="1.5"
            opacity="0.85"
          />
          <line
            x1="740"
            y1="500"
            x2="740"
            y2="760"
            stroke="rgba(239, 68, 68, 0.4)"
            strokeWidth="1"
          />
          <line
            x1="890"
            y1="450"
            x2="890"
            y2="880"
            stroke="url(#neon-strip-grad)"
            strokeWidth="2"
            filter="url(#beacon-filter)"
          />
        </g>

        {/* Midground Spire Beacon Lights */}
        <g opacity={beaconGlow} filter="url(#beacon-filter)">
          <circle cx="440" cy="480" r="3" fill="#ff3333" />
          <circle cx="740" cy="390" r="4" fill="#ff1a1a" />
          <circle cx="870" cy="420" r="2.5" fill="#ff4d4d" />
          <circle cx="940" cy="420" r="2.5" fill="#ff4d4d" />
        </g>

        {/* Midground Window Grid Illumination (Subtle Cyberpunk Office Backlights) */}
        <g opacity="0.38">
          {/* Tower 1 Window Grid */}
          {[660, 680, 700, 720, 750, 770, 800].map((y, row) => (
            <g key={`w-t1-${row}`}>
              <rect x="400" y={y} width="12" height="4" fill={row % 3 === 0 ? "#ff8888" : "#88ccff"} opacity={0.6} />
              <rect x="420" y={y} width="12" height="4" fill="#66aacc" opacity={0.4} />
              <rect x="440" y={y} width="12" height="4" fill={row % 2 === 0 ? "#ff9999" : "#5599bb"} opacity={0.5} />
              <rect x="460" y={y} width="12" height="4" fill="#77bbee" opacity={0.45} />
            </g>
          ))}

          {/* Blade Tower Window Matrix */}
          {[520, 545, 570, 595, 620, 645, 680, 710, 740, 770].map((y, row) => (
            <g key={`w-t2-${row}`}>
              <rect x="560" y={y} width="15" height="5" fill={row % 4 === 0 ? "#ff5555" : "#77aadd"} opacity={0.55} />
              <rect x="585" y={y} width="15" height="5" fill="#5588aa" opacity={0.4} />
              <rect x="610" y={y} width="15" height="5" fill={row % 3 === 0 ? "#ff7777" : "#6699cc"} opacity={0.5} />
            </g>
          ))}

          {/* Twin Apex Windows */}
          {[500, 530, 560, 590, 630, 670, 710, 750].map((y, row) => (
            <g key={`w-t3-${row}`}>
              <rect x="850" y={y} width="18" height="5" fill={row % 2 === 0 ? "#ff6666" : "#66bbee"} opacity={0.5} />
              <rect x="910" y={y} width="18" height="5" fill="#77ccee" opacity={0.45} />
              <rect x="940" y={y} width="18" height="5" fill={row % 3 === 0 ? "#ff5555" : "#5599cc"} opacity={0.4} />
            </g>
          ))}
        </g>

        {/* ========================================================
            LAYER 3: Foreground Monoliths (Deepest Charcoal Contrast)
           ======================================================== */}
        <g
          transform={`translate(${citySwayNear}, 0)`}
          fill="#020409"
        >
          {/* Foreground Tower Left */}
          <polygon points="620,1080 620,680 710,610 770,610 770,1080" />
          
          {/* Foreground Dark Blade Right */}
          <polygon points="800,1080 800,590 870,550 930,590 930,1080" />
          <line x1="870" y1="550" x2="870" y2="490" stroke="#050b18" strokeWidth="3" />

          {/* Massive Monolith Corner */}
          <rect x="980" y="640" width="268" height="440" />
        </g>

        {/* Foreground Monolith Neon Accents */}
        <g opacity={neonBreath}>
          <line
            x1="710"
            y1="610"
            x2="770"
            y2="610"
            stroke="url(#neon-strip-grad)"
            strokeWidth="2.5"
            filter="url(#beacon-filter)"
          />
          <line
            x1="800"
            y1="600"
            x2="800"
            y2="920"
            stroke="rgba(226, 54, 54, 0.45)"
            strokeWidth="1.5"
          />
          <circle
            cx="870"
            cy="490"
            r="3.5"
            fill="#ff1a1a"
            opacity={beaconGlow}
            filter="url(#beacon-filter)"
          />
        </g>

        {/* Ground Volumetric Mist / Cyberpunk Street Fog */}
        <rect
          x="300"
          y="880"
          width="948"
          height="200"
          fill="url(#skyline-crimson-glow)"
          opacity={0.35 + 0.15 * Math.sin(loopProgress)}
        />
      </svg>
    </div>
  );
};
