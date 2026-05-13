import React from 'react';
import MultiColumnList from '../../../lib/MultiColumnList';

const contentData = [
  { title: 'Alice', email: 'alice@example.org', status: 'Active' },
  { title: 'Ben', email: 'ben@example.org', status: 'Inactive' },
  { title: 'Carla', email: 'carla@example.org', status: 'Active' },
];

export default function MiniMultiColumnListExample() {
  return (
    <MultiColumnList
      height={180}
      contentData={contentData}
      columnMapping={{
        title: 'Name',
        email: 'Email',
        status: 'Status',
      }}
      visibleColumns={['title', 'email', 'status']}
    />
  );
}
