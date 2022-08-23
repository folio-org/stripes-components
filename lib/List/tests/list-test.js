/**
 * List tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { runAxeTest, converge, HTML, including } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';

import List from '../List';

const ListInteractor = HTML.extend('list')
  .selector('ul')
  .filters({
    itemCount: (el) => el.querySelectorAll('li').length,
  });


const items = ['Apples', 'Bananas', 'Strawberries', 'Oranges'];

describe('List', () => {
  const list = new ListInteractor();
  beforeEach(async () => {
    await mount(
      <List items={items} />
    );
  });

  it('renders a UL', () => ListInteractor().exists());

  it('renders the correct count of items', () => list.has({ itemCount: items.length }));

  it('should have no axe errors - List', runAxeTest);

  describe('using style props', () => {
    beforeEach(async () => {
      await mount(
        <List
          items={items}
          marginBottom0
          listStyle="bullets"
        />
      );
    });

    it('renders the marginBottom0 class', () => list.has({ className: including('marginBottom0') }));

    it('renders the listStyleBullets class', () => list.has({ className: including('Bullets') }));
  });

  describe('using a custom formatter', () => {
    let itemCalls = 0;
    beforeEach(async () => {
      itemCalls = 0;
      await mount(
        <List
          items={items}
          itemFormatter={(item, i) => {
            itemCalls += 1;
            return (<li key={i}>item</li>);
          }}
        />
      );
    });

    it('calls the custom formatter', () => converge(() => itemCalls === 4));
  });

  describe('rendering for empty lists', () => {
    beforeEach(async () => {
      await mount(
        <List
          items={[]}
          isEmptyMessage="No items to show"
        />
      );
    });

    it('displays the empty message element', () => HTML('No items to show').exists());
  });
});
