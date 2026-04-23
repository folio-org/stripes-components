import React from 'react';
import List from '../../../lib/List';

export default function MiniListExample() {
  const items = ['Accounts', 'Courses', 'Invoices', 'Users'];

  return (
    <List
      listStyle="bullets"
      items={items}
      itemFormatter={(item, index) => <li key={`${item}-${index}`}>{item}</li>}
    />
  );
}
