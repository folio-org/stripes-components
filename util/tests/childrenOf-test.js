import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import ChildrenOfComponent from './ChildrenOfComponent';
import { mount } from '../../tests/helpers';

describe.only('childrenOf propType validator', () => {
  let consoleSpy;
  describe('not providing a required prop', () => {
    beforeEach(async () => {
      consoleSpy = sinon.spy(console, 'error');
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
      consoleSpy = sinon.spy(console, 'error');
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
});
