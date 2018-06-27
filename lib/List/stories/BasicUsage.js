/**
 * List Component: Basic Usage
 */

import React from 'react';
import List from '../List';

export default () => {
  const items = ['Bananas', 'Apples', 'Oranges', 'Kiwis', 'Strawberries'];

  const itemFormatter = (item, i) => (
    <li key={i}>
      {item}
    </li>
  );


  return (
    <div>
      List with array of items and itemFormatter (listStyle: default)<br /><br />
      <List
        items={items}
        itemFormatter={itemFormatter}
      />
      <br />
      <hr />
      <br />
      List with array of items and itemFormatter (listStyle: bullets)<br /><br />
      <List
        listStyle="bullets"
        items={items}
        itemFormatter={itemFormatter}
      />
      <br />
      <hr />
      <br />
      List with with no items that has isEmptyMessage prop<br /><br />
      <List isEmptyMessage="No items to show" items={[]} />
    </div>
  );
};
