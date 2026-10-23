import React from 'react';
import { describe, beforeEach, afterEach, it } from 'mocha';
import { runAxeTest, HTML, converge, Button, including } from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import PanesetHarness from './PanesetHarness';
import Paneset from '../Paneset';
import Pane from '../../Pane';
import { ResizeConsumer } from '../ResizeContext';

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
    },
    startDrag: async ({ perform }) => {
      await perform(el => el.dispatchEvent(new MouseEvent('mousedown')));
    },
    moveTo: async ({ perform }, x) => {
      await perform(() => document.dispatchEvent(new MouseEvent('mousemove', { clientX: x })));
    },
    endDrag: async ({ perform }) => {
      await perform(() => document.dispatchEvent(new MouseEvent('mouseup')));
    }
  });

// counts how many times the resize context consumer is re-rendered.
let consumerRenders = 0;
const RenderCounter = () => {
  consumerRenders += 1;
  return null;
};
const CountingConsumer = () => <ResizeConsumer>{() => <RenderCounter />}</ResizeConsumer>;

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

  describe('while the handle is being dragged', () => {
    beforeEach(async () => {
      consumerRenders = 0;
      await mountWithContext(
        <Paneset id="draggingSet">
          <Pane id="dragPaneA" paneTitle="first" defaultWidth="300px"><span>Content</span></Pane>
          <Pane id="dragPaneB" paneTitle="second" defaultWidth="300px"><span>Content</span></Pane>
          <CountingConsumer />
        </Paneset>
      );
      await ResizeHandleInteractor({ index: 0 }).startDrag();
    });

    afterEach(() => {
      // make sure that listeners and body styles don't leak into other tests
      document.dispatchEvent(new MouseEvent('mouseup'));
    });

    it('covers the page with a shield showing the resize cursor', async () => {
      await converge(() => {
        const shield = document.body.querySelector('[class^=dragShield]');
        return !!shield && getComputedStyle(shield).cursor === 'col-resize';
      });
    });

    it('keeps the mouse from reaching elements within the panes', async () => {
      const paneRect = document.querySelector('#dragPaneA').getBoundingClientRect();
      const x = paneRect.left + (paneRect.width / 2);
      const y = paneRect.top + (paneRect.height / 2);
      await converge(() => document.elementFromPoint(x, y)?.className.startsWith('dragShield'));
    });

    it('removes the shield if the paneset unmounts mid-drag', async () => {
      await mountWithContext(<span>nothing</span>);
      await converge(() => !document.body.querySelector('[class^=dragShield]'));
    });

    it('does not rerender resize context consumers on mouse movement', async () => {
      const rendersAfterMouseDown = consumerRenders;
      await ResizeHandleInteractor({ index: 0 }).moveTo(150);
      await ResizeHandleInteractor({ index: 0 }).moveTo(200);
      await ResizeHandleInteractor({ index: 0 }).moveTo(250);
      // give React (and the cursor's animation frame) a chance to flush anything the moves caused.
      await new Promise((resolve) => { requestAnimationFrame(() => requestAnimationFrame(resolve)); });
      await converge(() => consumerRenders === rendersAfterMouseDown);
    });

    it('removes the shield on release', async () => {
      await ResizeHandleInteractor({ index: 0 }).endDrag();
      await converge(() => !document.body.querySelector('[class^=dragShield]'));
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
