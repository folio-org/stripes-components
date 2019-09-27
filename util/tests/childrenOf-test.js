import React from 'react';
import { describe, beforeEach, afterEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import ChildrenOfComponent from './ChildrenOfComponent';
import ChildrenOfChild from './ChildrenOfChild';
import { mount } from '../../tests/helpers';

describe('childrenOf propType validator', () => {
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
