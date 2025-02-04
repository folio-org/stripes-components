import React from 'react';
import { describe, beforeEach, afterEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import ChildrenOfComponent from './ChildrenOfComponent';
import ChildrenOfChild from './ChildrenOfChild';
import { mount } from '../../../tests/helpers';

// The spread done in ChildrenOfComponent is invalid because `props` is an object
// and not an Iterable by itself: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
// The test and <ChildrenOfComponent> should be reworked before reintegrating this test.
describe.skip('childrenOf propType validator', () => {
  let consoleSpy;
  afterEach(() => {
    console.error.restore();
  });

  beforeEach(() => {
    consoleSpy = sinon.spy(console, 'error');
  });

  describe('not providing a required prop', () => {
    beforeEach(async () => {
      await mount(
        <ChildrenOfComponent />
      );
    });

    it('triggers a required propType error', () => {
      expect(consoleSpy.called).to.be.true;
    });
  });

  describe('Passing a type that isn\'t allowed', () => {
    beforeEach(async () => {
      await mount(
        <ChildrenOfComponent
          child={<div>not allowed</div>}
        />
      );
    });

    it('triggers a propType error', () => {
      expect(consoleSpy.called).to.be.true;
    });
  });

  describe('Passing a type that isn\'t allowed', () => {
    beforeEach(async () => {
      await mount(
        <ChildrenOfComponent
          child={<ChildrenOfChild />}
        />
      );
    });

    it('triggers no proptype error', () => {
      expect(consoleSpy.called).to.be.false;
    });
  });
});
