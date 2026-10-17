import React from "react";
import { Player } from "@remotion/player";
import { CyberpunkBackgroundComposition } from "./CyberpunkBackgroundComposition";

/**
 * High-end, atmospheric looping website background video component using Remotion.
 * 
 * Specifications:
 * - 10 seconds seamless loop (300 frames @ 30fps)
 * - 1920x1080 Full HD
 * - Moody cyberpunk aesthetic (deep navy, midnight blue, charcoal black)
 * - Right side: Stylized cityscape with red beacons, backlit windows, and slow-panning crimson neon
 * - Left side: Clean negative space with tech grid and subtle cyber web lines
 * - Atmosphere: Digital rain streaks and floating dust motes
 * - Optimized for smooth 60fps web background playback
 */
export const RemotionBackground: React.FC = () => {
  return (
    <div className="w-full h-full pointer-events-none select-none overflow-hidden relative">
      <Player
        component={CyberpunkBackgroundComposition}
        durationInFrames={300}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        loop
        autoPlay
        controls={false}
        clickToPlay={false}
        doubleClickToFullscreen={false}
        spaceKeyToPlayOrPause={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Atmospheric Overlays for Web Readability */}
      {/* Subtle contrast glaze */}
      <div className="absolute inset-0 bg-[#02040a]/35 pointer-events-none" />

      {/* Seamless blend from the (SPIDER-MAN) title card transition into the hero section */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#040711] via-[#040711]/60 to-transparent pointer-events-none" />

      {/* Soft bottom grounding fade into footer */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#040711] via-[#040711]/60 to-transparent pointer-events-none" />
    </div>
  );
};
