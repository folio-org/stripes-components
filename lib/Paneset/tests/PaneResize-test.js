import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';

import PanesetInteractor, { ResizeInteractor } from './interactor';
import PaneInteractor from '../../Pane/tests/interactor';

import Paneset from '../Paneset';
import Pane from '../../Pane';

describe.only('Pane Resizing', () => {
  const paneset = new PanesetInteractor();
  const resize = new ResizeInteractor();
  const shrunkenPane = new PaneInteractor('#resultPane');
  const widenedPane = new PaneInteractor('#detailPane');
  beforeEach(async() => {
    await mountWithContext(
      <Paneset id="nestedSet">
          <Pane id="searchPane" defaultWidth="100px"><span>Content</span></Pane>
          <Pane id="resultPane" defaultWidth="300px"><span>Content</span></Pane>
          <Pane id="detailPane" defaultWidth="200px"><span>Content</span></Pane>
          <Paneset id="nestedSet">
            <Pane id="nestedPaneA" defaultWidth="100px"><span>Content</span></Pane>
            <Pane id="nestedPaneB" defaultWidth="100px"><span>Content</span></Pane>
          </Paneset>
        </Paneset>
      );
  });

  it('renders', () => {
    expect(paneset.isPresent).to.be.true;
  });

  it('renders a pane resize handle', () => {
    expect(resize.handles().length).to.equal(4);
  });

  describe('dragging the handle', () => {
    beforeEach(async() => {
      await resize.dragTo(1, 200);
    });

    it('moves cursor to position', () => {
      expect(resize.cursorPos).to.equal('200px');
    });

    it('hides the cursor', () => {
      expect(resize.cursor.isVisible).to.be.false;
    });

    it('resizes the panes', () => {
      expect(parseInt(shrunkenPane.computedWidth)).to.be.lt(300);
      expect(parseInt(widenedPane.computedWidth)).to.be.gt(200);
    });
  });
});
