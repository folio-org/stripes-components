import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { runAxeTest, HTML, converge, Button, including } from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import PanesetHarness from './PanesetHarness';
import Paneset from '../Paneset';
import Pane from '../../Pane';

function withWidth(comparator) {
  return {
    match(actual) {
      return comparator(actual.getBoundingClientRect().width);
    },
    description() {
      return `client width comparison: ${comparator}`;
    }
  };
}


const PanesetInteractor = HTML.extend('paneset')
  .selector('[class^=paneset]');

const ResizingPaneInteractor = HTML.extend('resizing pane')
  .selector('section [class^=pane]')
  .filters({
    title: (el) => el.querSelector('h2').textContent,
    width: (el) => el.offsetWidth,
    style: (el) => el.style,
  });

const ResizeHandleInteractor = HTML.extend('pane resize handle')
  .selector('[class^=handle-][role=presentation]')
  .filters({
    index: (el) => [...el.parentElement.children].indexOf(el),
    count: (el) => [...el.parentNode.children].length
  })
  .actions({
    dragTo: async ({ perform }, x) => {
      await perform(el => el.dispatchEvent(new MouseEvent('mousedown')));
      await perform(() => document.dispatchEvent(new MouseEvent('mousemove', { clientX: x })));
      await perform(() => document.dispatchEvent(new MouseEvent('mouseup')));
    }
  });

const ResizeCursorInteractor = HTML.extend('pane resize cursor')
  .selector('[class^=cursor-]')
  .filters({
    position: el => el.getBoundingClientRect().left
  });

describe('Pane Resizing', () => {
  let handleResize = false;
  const paneset = PanesetInteractor();
  const resizeHandle = ResizeHandleInteractor();
  const shrunkenPane = ResizingPaneInteractor('result');
  const widenedPane = ResizingPaneInteractor('test2');
  const resizeCursor = ResizeCursorInteractor();

  beforeEach(async () => {
    const resizeCallback = () => { handleResize = true; }
    await mountWithContext(
      <Paneset id="nestedSet" onResize={resizeCallback}>
        <Pane id="searchPane" paneTitle="search" defaultWidth="100px"><span>Content</span></Pane>
        <Pane id="resultPane" paneTitle="result" defaultWidth="300px"><span>Content</span></Pane>
        <Pane id="detailPane" paneTitle="test2" defaultWidth="200px"><span>Content</span></Pane>
        <Paneset id="nestedSetB">
          <Pane id="nestedPaneA" paneTitle="test-nested-1" defaultWidth="100px"><span>Content</span></Pane>
          <Pane id="nestedPaneB" paneTitle="test-nested-2" defaultWidth="100px"><span>Content</span></Pane>
        </Paneset>
      </Paneset>
    );
  });

  it('should have no axe errors - Pane resize', runAxeTest);

  it('renders', () => {
    paneset.exists();
  });

  it('renders a pane resize handle', () => {
    resizeHandle.has({ index: 3 });
  });

  describe('dragging the handle', () => {
    beforeEach(async () => {
      await ResizeHandleInteractor({ index: 1 }).dragTo(100);
    });

    it('moves cursor to position', () => {
      resizeCursor.has({ position: 190 });
    });

    it('hides the cursor', () => {
      resizeCursor.is({ visible: false });
    });

    it('resizes the panes', async () => {
      shrunkenPane.has({ width: withWidth(w => w < 100) });
      widenedPane.has({ width: withWidth(w => w > 200) });
    });

    it('calls the onResize callback', () => {
      converge(() => handleResize === true);
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
          <Pane id="searchPane" defaultWidth="100px"><span>Content</span></Pane>
          <Pane id="resultPane" defaultWidth="100px"><span>Content</span></Pane>
          <Pane id="detailPane" defaultWidth="100px"><span>Content</span></Pane>
          <Paneset id="nestedSet">
            <Pane id="nestedPaneA" defaultWidth="fill"><span>Content</span></Pane>
            <Pane id="nestedPaneB" defaultWidth="fill"><span>Content</span></Pane>
          </Paneset>
        </Paneset>
      );
    });

    it('sets pane widths according to the initial layout', () => {
      shrunkenPane.has({ style: including('20%') });
      widenedPane.has({ style: including('30%') });
    });
  });

  describe('handles not present when overlapped', () => {
    const modalToggle = Button('Toggle Overlapping Modal');
    const modalClose = Button('Close Modal');

    beforeEach(async () => {
      mountWithContext(<PanesetHarness init={{ showDetail: true }} />);
      await modalToggle.click();
    });

    it('does not render resize handles when panes are overlapped', () => {
      resizeHandle.absent();
    });

    describe('When the overlapping element is closed', () => {
      beforeEach(async () => {
        await modalClose.click();
      });

      it('resize handles return', () => {
        resizeHandle.exists();
      });
    });
  });
});
