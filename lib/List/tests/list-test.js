/**
 * List tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';

import List from '../List';
import ListInteractor from './interactor';

const items = ['Apples', 'Bananas', 'Strawberries', 'Oranges'];

describe('List', () => {
  const list = new ListInteractor();
  beforeEach(async () => {
    await mount(
      <List items={items} />
    );
  });

  it('renders a UL', () => {
    expect(list.hasUL).to.be.true;
  });

  it('renders the correct count of items', () => {
    expect(list.itemCount).to.equal(items.length);
  });

  it('renders the default class', () => {
    expect(list.hasDefaultClass).to.be.true;
  });

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

    it('renders the marginBottom0 class', () => {
      expect(list.hasMarginBottom0Class).to.be.true;
    });

    it('renders the listStyleBullets class', () => {
      expect(list.hasBulletedClass).to.be.true;
    });
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

    it('calls the custom formatter', () => {
      expect(itemCalls).to.equal(4);
    });
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

    it('displays the empty message element', () => {
      expect(list.hasEmptyMessage).to.be.true;
    });

    it('displays the suppied empty message prop', () => {
      expect(list.emptyMessageText).to.equal('No items to show');
    });
  });
});
