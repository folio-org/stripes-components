import React, { useRef } from 'react';
import ConflictDetectionBanner from '../../../lib/ConflictDetectionBanner';

export default function MiniConflictDetectionBannerExample() {
  const bannerRef = useRef(null);

  return (
    <ConflictDetectionBanner
      latestVersionLink="/records/123/view"
      conflictDetectionBannerRef={bannerRef}
      focusConflictDetectionBanner={() => bannerRef.current?.focus()}
    />
  );
}
