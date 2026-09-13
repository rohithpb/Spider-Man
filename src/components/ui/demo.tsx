"use client";

import React, { useEffect, useState } from "react";
import GlyphPortal from "@/components/ui/glyph-portal";

const settings = {
  word: "SPIDER-MAN",
  scrollLength: 2.2,
  interactive: true,
  annotations: false,
};

const family = '"Arial Black", Impact, sans-serif';

interface DemoProps {
  onEnter?: () => void;
  word?: string;
  scrollLength?: number;
  interactive?: boolean;
  annotations?: boolean;
}

export default function Demo(props: DemoProps) {
  const s = { ...settings, ...props };
  const [face, setFace] = useState<string | null>(null);

  useEffect(() => {
    setFace(family);
  }, []);

  return (
    <div
      data-demo-scroll
      data-slipstream-demo
      tabIndex={0}
      role="region"
      aria-label="Spider-Man Glyph Portal. Scroll to step inside."
      style={{
        width: "100%",
        minHeight: "100svh",
        background: "#040711",
        color: "#ffffff",
        containerType: "inline-size",
        fontFamily: face ?? "Arial, sans-serif",
        position: "relative",
      }}
    >
      <style>{`
        /* Keep live interactive SVG glyph art visible with glowing ink */
        [data-slipstream-demo] [data-gp-art]{
          opacity: 1 !important;
          pointer-events: auto !important;
        }
        
        [data-slipstream-demo] [data-gp-caption]{
          position: absolute;
          inset: auto 0 clamp(16px, 3vh, 32px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 30;
          pointer-events: auto;
        }
        
        [data-slipstream-demo] [data-gp-hint]{ display: none; }
        
        [data-slipstream-demo] [data-gp-enter]{
          min-height: 50px;
          padding: 0 32px;
          gap: 10px;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.45) 0%, rgba(226, 54, 54, 0.25) 50%, rgba(153, 27, 27, 0.55) 100%);
          border: 1px solid rgba(255, 140, 140, 0.55);
          border-radius: 9999px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.03em;
          box-shadow: 
            inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.75),
            inset 0 -2px 4px 0 rgba(0, 0, 0, 0.4),
            0 8px 30px -4px rgba(226, 54, 54, 0.6);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        [data-slipstream-demo] [data-gp-enter]::before{
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 48%;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 80%, transparent 100%);
          border-radius: inherit;
          pointer-events: none;
        }
        [data-slipstream-demo] [data-gp-enter]:hover{
          background: linear-gradient(135deg, rgba(255, 90, 90, 0.65) 0%, rgba(226, 54, 54, 0.45) 50%, rgba(185, 28, 28, 0.7) 100%);
          border-color: rgba(255, 255, 255, 0.85);
          box-shadow: 
            inset 0 2px 2px 0 rgba(255, 255, 255, 0.9),
            0 14px 40px -2px rgba(226, 54, 54, 0.85);
          transform: translateY(-2px) scale(1.02);
        }
        [data-slipstream-demo] [data-gp-enter]:active{
          transform: translateY(0.5px) scale(0.98);
        }
        [data-slipstream-demo] [data-gp-enter]:focus-visible{
          outline: 2px solid rgba(255, 255, 255, 0.8);
          outline-offset: 4px;
        }

        [data-slipstream-copy]{
          display: flex;
          width: min(100%, 80rem);
          margin: auto;
          flex-direction: column;
          align-items: flex-start;
          gap: clamp(2rem, 5svh, 3.5rem);
          color: #ffffff;
          padding-bottom: clamp(6rem, 14vh, 12rem);
        }
        [data-slipstream-copy] h2{
          max-width: 48rem;
          margin: 0;
          color: #ffffff;
          font-size: clamp(2rem, 1.5rem + 2.5cqw, 3rem);
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -0.02em;
          text-wrap: balance;
        }
        [data-slipstream-features]{
          display: grid;
          width: 100%;
          grid-template-columns: 1fr;
          gap: 1.75rem;
        }
        [data-slipstream-feature]{
          border-top: 1px solid rgba(226, 54, 54, 0.3);
          padding-top: 1.25rem;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(226, 54, 54, 0.2);
        }
        [data-slipstream-feature] h3{
          margin: 0;
          color: #ffffff;
          font-size: 1.125rem;
          font-weight: 700;
          line-height: 1.2;
        }
        [data-slipstream-feature] p{
          margin: 0.55rem 0 0;
          color: #94a3b8;
          font-size: 0.9375rem;
          line-height: 1.55;
        }
        [data-slipstream-no]{
          display: inline-block;
          margin-right: 0.7rem;
          color: #E23636;
          font: 700 0.85rem ui-monospace, monospace;
          letter-spacing: 0.08em;
        }
        @container(min-width: 768px){
          [data-slipstream-features]{
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 2.5rem;
          }
        }
      `}</style>

      {face ? (
        <GlyphPortal
          word={s.word}
          fontFamily={face}
          fontWeight={900}
          style={{
            fontFamily: face,
            "--gp-paper": "#040711",
            "--gp-ink": "#ff4444",
            "--gp-field": "#E23636",
            "--gp-foreground": "#ffffff",
          }}
          scrollLength={s.scrollLength}
          interactive={s.interactive}
          annotations={s.annotations}
          enterLabel="Scroll for a closer look"
          background={
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, #ff3333 0%, #E23636 40%, #c41e1e 70%, #991b1b 100%)",
                boxShadow: "inset 0 0 100px rgba(0, 0, 0, 0.5)",
              }}
            />
          }

        >
          {/* Content revealed once user steps inside or scrolls through the portal */}
          <div data-slipstream-copy id="portal-destination">
            <h2>Step Inside the Superhero Dispatch Network.</h2>
            <div data-slipstream-features>
              <div data-slipstream-feature>
                <h3>
                  <span data-slipstream-no>01</span>Direct Superhero Comm
                </h3>
                <p>
                  No intermediaries. Speak directly with Spider-Man through the
                  Friendly Neighborhood Dispatch Desk below.
                </p>
              </div>
              <div data-slipstream-feature>
                <h3>
                  <span data-slipstream-no>02</span>Gemini AI Neural Link
                </h3>
                <p>
                  Integrated with Google Gemini AI to parse natural conversational
                  statements and extract clean identity records in real time.
                </p>
              </div>
              <div data-slipstream-feature>
                <h3>
                  <span data-slipstream-no>03</span>Automated Dispatch Alert
                </h3>
                <p>
                  Instant emergency alerts dispatched straight to candidate
                  personal email the moment your grievance is registered.
                </p>
              </div>
            </div>

            <div className="pt-6 pb-6">
              <a
                href="#help-portal"
                className="btn-liquid-glass btn-liquid-spidey inline-flex items-center gap-3 px-9 py-4 rounded-2xl text-white font-extrabold text-sm tracking-wider uppercase transition-all"
              >
                <span>Enter Friendly Neighborhood Dispatch Desk</span>
                <span>↓</span>
              </a>
            </div>
          </div>
        </GlyphPortal>
      ) : (
        <div
          role="status"
          style={{
            height: "100vh",
            display: "grid",
            placeItems: "center",
            color: "#94a3b8",
            fontSize: 14,
          }}
        >
          Initializing Spider-Man Glyph Portal…
        </div>
      )}

      {/* Seamless bottom transition gradient into the Hero Dossier below */}
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none bg-gradient-to-b from-transparent via-[#040711]/80 to-[#040711] z-20" />
    </div>
  );
}
