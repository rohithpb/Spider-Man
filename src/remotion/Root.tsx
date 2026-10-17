import React from 'react';
import { Composition } from 'remotion';
import { CyberpunkBackgroundComposition } from '../components/remotion/CyberpunkBackgroundComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CyberpunkBackground"
        component={CyberpunkBackgroundComposition}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
