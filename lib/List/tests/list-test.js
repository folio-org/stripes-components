/**
 * List tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { runAxeTest, converge, HTML, including, List as ListInteractor, ListItem } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';

import List from '../List';

const LocalListInteractor = ListInteractor.extend('list')
  .filters({
    className: (el) => [...el.classList].join(' '),
  });

const items = ['Apples', 'Bananas', 'Strawberries', 'Oranges'];

describe('List', () => {
  const list = new LocalListInteractor();
  beforeEach(async () => {
    await mount(
      <List items={items} />
    );
  });

  it('renders a UL', () => ListInteractor().exists());

  it('renders the correct count of items', () => list.has({ count: items.length }));

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

    it('renders list correct list items', () => ListItem('Apples').exists());
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

  describe('supplying an id prop', () => {
    beforeEach(async () => {
      await mount(
        <List
          items={['one', 'two', 'three']}
          id="testId"
        />
      );
    });

    it('displays the provided id attribute', () => ListInteractor('testId').exists());
  });

  describe('custom list formatters', () => {
    beforeEach(async () => {
      await mount(
        <List
          items={['one', 'two', 'three']}
          id="testId"
          itemFormatter={item => <li className="test-list-class">{ item }</li>}
        />
      );
    });

    it('renders the custom formatter', () => ListItem({ className: 'test-list-class' }).exists());
  });
});
