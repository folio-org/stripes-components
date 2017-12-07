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
    <div style={{padding: '15px'}}>
      List with array of items and itemFormatter (listStyle "default")<br /><br />
      <List
        items={items}
        itemFormatter={itemFormatter}
      />
      <br />
      <hr />
      <br />
      List with children (listStyle "bullets")<br /><br />
      <List listStyle="bullets">
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
        <li>Item 4</li>
        <li>
          Sub List
          <ul>
            <li>Sub list item 1</li>
            <li>Sub list item 2</li>
            <li>Sub list item 3</li>
            <li>Sub list item 4</li>
          </ul>
        </li>
        <li>Item 6</li>
      </List>
      <hr />
      <br />
      List with with no items that has "isEmptyMessage"-prop<br /><br />
      <List isEmptyMessage="No items to show" items={[]} />
    </div>
  );
};
