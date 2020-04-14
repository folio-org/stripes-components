import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import { mountWithContext } from '../../../tests/helpers';

import PanesetInteractor, { ResizeInteractor } from './interactor';
import PaneInteractor from '../../Pane/tests/interactor';

import Paneset from '../Paneset';
import Pane from '../../Pane';

describe('Pane Resizing', () => {
  let handleResize;
  const paneset = new PanesetInteractor();
  const resize = new ResizeInteractor();
  const shrunkenPane = new PaneInteractor('#resultPane');
  const widenedPane = new PaneInteractor('#detailPane');
  beforeEach(async () => {
    handleResize = sinon.spy();
    await mountWithContext(
      <Paneset id="nestedSet" onResize={handleResize}>
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
    beforeEach(async () => {
      await resize.dragTo(1, 200);
    });

    it('moves cursor to position', () => {
      expect(resize.cursorPos).to.equal('190px');
    });

    it('hides the cursor', () => {
      expect(resize.cursor.isVisible).to.be.false;
    });

    it('resizes the panes', () => {
      expect(parseInt(shrunkenPane.computedWidth, 10)).to.be.lt(300);
      expect(parseInt(widenedPane.computedWidth, 10)).to.be.gt(200);
    });

    it('calls the onResize callback', () => {
      expect(handleResize.called).to.be.true;
    });
  });

  describe('setting initial sizes', () => {
    beforeEach(async () => {
      const layouts = [{
        searchPane: '20%',
        resultPane: '20%',
        detailPane: '30%',
        nestedSet: '20%',
      }];

      await mountWithContext(
        <Paneset id="nestedSet" initialLayouts={layouts}>
          <Pane id="searchPane" defaultWidth="fill"><span>Content</span></Pane>
          <Pane id="resultPane" defaultWidth="fill"><span>Content</span></Pane>
          <Pane id="detailPane" defaultWidth="fill"><span>Content</span></Pane>
          <Paneset id="nestedSet">
            <Pane id="nestedPaneA" defaultWidth="fill"><span>Content</span></Pane>
            <Pane id="nestedPaneB" defaultWidth="fill"><span>Content</span></Pane>
          </Paneset>
        </Paneset>
      );
    });

    it('sets pane widths according to the initial layout', () => {
      expect(shrunkenPane.style.includes('20%')).to.be.true;
      expect(widenedPane.style.includes('30%')).to.be.true;
    });
  });
});
