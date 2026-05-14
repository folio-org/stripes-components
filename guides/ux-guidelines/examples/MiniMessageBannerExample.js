import React from 'react';
import MessageBanner from '../../../lib/MessageBanner';

export default function MiniMessageBannerExample() {
  return (
    <div style={{ maxWidth: 640 }}>
      <MessageBanner type="warning">This action requires confirmation before continuing.</MessageBanner>
    </div>
  );
}
