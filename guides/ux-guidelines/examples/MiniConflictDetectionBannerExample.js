import React, { useRef } from 'react';
import { HashRouter } from 'react-router-dom';
import ConflictDetectionBanner from '../../../lib/ConflictDetectionBanner';

export default function MiniConflictDetectionBannerExample() {
  const bannerRef = useRef(null);

  return (
    <HashRouter>
      <ConflictDetectionBanner
        latestVersionLink="/records/123/view"
        conflictDetectionBannerRef={bannerRef}
        focusConflictDetectionBanner={() => bannerRef.current?.focus()}
      />
    </HashRouter >
  );
}
