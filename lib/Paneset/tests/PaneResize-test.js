import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';

import PanesetInteractor, { ResizeInteractor } from './interactor';
import PanesetHarness from './PanesetHarness';
import Paneset from '../Paneset';
import Pane from '../../Pane';

describe('Pane Resizing', () => {
  const paneset = new PanesetInteractor();
  const resize = new ResizeInteractor();

  beforeEach(async() => {
    await mountWithContext(
      <PanesetHarness>
        <Paneset id="nestedSet">
          <Pane id="nestedPane" defaultWidth="100px"><span>Content</span></Pane>
        </Paneset>
      </PanesetHarness>
    );
  });

  it('renders', () => {
    expect(paneset.isPresent).to.be.true;
  });

  it('renders a pane resize handle', () => {
    expect(resize.handles().length).to.equal(3);
  });

  describe('dragging the handle', () => {
    beforeEach(async() => {
      await resize.dragTo(1, 350);
    });

    it('moves cursor to position', () => {
      expect(resize.cursorPos).to.equal('350px');
    });

    it('hides the cursor', () => {
      expect(resize.cursor.isVisible).to.be.false;
    });
  });
});
