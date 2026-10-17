import React from "react";
import { useCurrentFrame, AbsoluteFill } from "remotion";
import { TechGridWeb } from "./TechGridWeb";
import { CyberpunkCityscape } from "./CyberpunkCityscape";
import { AtmosphericEffects } from "./AtmosphericEffects";

/**
 * Master Cyberpunk Background Composition (1920x1080 @ 30fps, 300 frames / 10s loop)
 * 
 * Design Specifications:
 * 1. Duration: 10s (300 frames) seamless loop at Full HD 1920x1080.
 * 2. Palette: Deep navy, midnight blue, charcoal black with slow-panning crimson neon glows on right.
 * 3. Layers:
 *    - Left: Tech grid & geometric web negative space
 *    - Right: Stylized cyberpunk skyscraper skyline with crimson beacons & windows
 *    - Atmosphere: Digital rain streaks & floating ambient dust motes
 * 4. Dynamics: Slow continuous camera drift, breathing ambient glow, zero-jump loop.
 */
export const CyberpunkBackgroundComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const totalFrames = 300;
  const loopProgress = (frame / totalFrames) * 2 * Math.PI;

  // Subtle continuous cinematic camera float (seamless loop)
  const cameraDriftX = Math.sin(loopProgress) * 14;
  const cameraDriftY = Math.cos(loopProgress) * 7;
  const cameraScale = 1.025 + Math.sin(loopProgress) * 0.008;

  // Slow-panning ambient crimson neon glow on the right
  const glowPosX = 75 + Math.sin(loopProgress) * 8; // Pan between 67% and 83%
  const glowPosY = 55 + Math.cos(loopProgress) * 5; // Pan between 50% and 60%
  const glowRadius = 55 + Math.sin(loopProgress) * 6; // Breathing radius
  const glowOpacity = 0.32 + Math.sin(loopProgress) * 0.12;

  // Secondary deep cyan/sky-blue fill on mid-left
  const cyanGlowOpacity = 0.14 + Math.cos(loopProgress) * 0.04;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#02040a",
        width: 1920,
        height: 1080,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Dynamic Camera Drift Wrapper */}
      <div
        style={{
          position: "absolute",
          inset: -30,
          transform: `translate3d(${cameraDriftX}px, ${cameraDriftY}px, 0) scale(${cameraScale})`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        {/* Layer 0: Atmospheric Deep Navy & Midnight Background Gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 120% 100% at 20% 15%, #050b1d 0%, #030612 45%, #010308 100%)",
          }}
        />

        {/* Layer 1: Panning Deep Cyan Ambient Glow (Left Negative Space) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle 600px at 15% 30%, rgba(2, 132, 199, ${cyanGlowOpacity}) 0%, transparent 80%)`,
            pointerEvents: "none",
          }}
        />

        {/* Layer 2: Slow-Panning Crimson Neon Skyline Glow (Right Side) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle ${glowRadius}% at ${glowPosX}% ${glowPosY}%, rgba(226, 54, 54, ${glowOpacity}) 0%, rgba(185, 28, 28, ${glowOpacity * 0.55}) 35%, rgba(15, 23, 42, 0.15) 70%, transparent 100%)`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />

        {/* Layer 3: Left Side Negative Space - Tech Grid & Geometric Cyber Web */}
        <TechGridWeb />

        {/* Layer 4: Right Side - Stylized Cyberpunk Skyscrapers & Red Beacons */}
        <CyberpunkCityscape />

        {/* Layer 5: Atmospheric Digital Rain & Floating Ambient Dust Motes */}
        <AtmosphericEffects />

        {/* Layer 6: Subtle Cinematic Vignette & Edge Shadowing */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(2, 4, 10, 0.45) 80%, rgba(1, 2, 6, 0.85) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
