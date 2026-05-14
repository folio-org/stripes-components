import React from 'react';
import Icon from '../../../lib/Icon';

export default function MiniIconExample() {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Icon icon="search">Search</Icon>
      <Icon icon="info" status="success" />
      <Icon icon="warning" status="warn" />
    </div>
  );
}
