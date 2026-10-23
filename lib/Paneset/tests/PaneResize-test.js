import React from 'react';
import { describe, beforeEach, afterEach, it } from 'mocha';
import { runAxeTest, HTML, converge, Button } from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import PanesetHarness from './PanesetHarness';
import Paneset from '../Paneset';
import Pane from '../../Pane';
import { ResizeConsumer } from '../ResizeContext';

// converge() only retries while its callback throws, so a falsy return value would pass immediately.
const until = (condition) => converge(() => {
  if (!condition()) throw new Error(`condition not met: ${condition}`);
});


const PanesetInteractor = HTML.extend('paneset')
  .selector('[class^=paneset]');

const ResizeHandleInteractor = HTML.extend('pane resize handle')
  .selector('[class^=handle-][role=presentation]')
  .filters({
    index: (el) => [...el.parentElement.children].indexOf(el),
    count: (el) => [...el.parentNode.children].length
  })
  // mousedown must bubble to reach React's root listener. The handle's own position is used as the start x.
  .actions({
    dragTo: async ({ perform }, x) => {
      await perform(el => el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: el.getBoundingClientRect().left })));
      await perform(() => document.dispatchEvent(new MouseEvent('mousemove', { clientX: x })));
      await perform(() => document.dispatchEvent(new MouseEvent('mouseup')));
    },
    startDrag: async ({ perform }) => {
      await perform(el => el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: el.getBoundingClientRect().left })));
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

// Reads a pane's rendered width by title.
const paneWidth = (paneTitle) => [...document.querySelectorAll('section[class^=pane]')]
  .find((el) => el.querySelector('[class^=paneTitle]')?.textContent === paneTitle)?.offsetWidth;

// Exposes the resize context functions that Pane and Layer normally use.
const ResizeControls = () => (
  <ResizeConsumer>
    {(resizer) => (
      <>
        <button type="button" onClick={resizer.suspend}>suspend resizing</button>
        <button type="button" onClick={resizer.resume}>resume resizing</button>
        <button type="button" onClick={resizer.updateHandle}>update handles</button>
      </>
    )}
  </ResizeConsumer>
);

describe('Pane Resizing', () => {
  const paneset = PanesetInteractor();
  const resizeHandle = ResizeHandleInteractor();
  const resizeCursor = ResizeCursorInteractor();

  beforeEach(async () => {
    await mountWithContext(
      <Paneset id="nestedSet">
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

  it('renders', async () => {
    await paneset.exists();
  });

  it('renders a pane resize handle', async () => {
    await ResizeHandleInteractor({ index: 3 }).exists();
  });

  describe('dragging the handle', () => {
    beforeEach(async () => {
      await ResizeHandleInteractor({ index: 1 }).dragTo(100);
    });

    it('moves cursor to position', async () => {
      // the cursor is hidden after release, so read the position the container left on its element.
      // the previous handle sits at x=100 and the cursor stops 20px past it, centered by a 10px offset.
      await until(() => document.querySelector('[class^=cursorHover]')?.style.left === '110px');
    });

    it('hides the cursor', async () => {
      await resizeCursor.is({ visible: false });
    });

    it('resizes the panes', async () => {
      await until(() => paneWidth('result') < 100);
      await until(() => paneWidth('test2') > 200);
    });

  });

  describe('reporting a resize', () => {
    let resizeCalls;

    beforeEach(async () => {
      resizeCalls = [];
      await mountWithContext(
        <Paneset id="reportSet" onResize={(args) => resizeCalls.push(args)}>
          <Pane id="reportA" paneTitle="report a" defaultWidth="300px"><span>Content</span></Pane>
          <Pane id="reportB" paneTitle="report b" defaultWidth="300px"><span>Content</span></Pane>
        </Paneset>
      );
      // wait for the layout reported on mount, then watch for the one caused by the drag.
      await until(() => resizeCalls.length > 0);
      resizeCalls.length = 0;
    });

    it('calls the onResize callback with the new layout', async () => {
      await ResizeHandleInteractor({ index: 0 }).dragTo(200);
      await until(() => resizeCalls.length > 0);
    });
  });

  describe('dragging beyond neighboring handles', () => {
    it('keeps a handle from being dragged past the previous handle', async () => {
      const before = paneWidth('result');
      await ResizeHandleInteractor({ index: 1 }).dragTo(-1000);
      await converge(() => {
        const after = paneWidth('result');
        // the cursor stops short of the previous handle, so the pane shrinks but is not collapsed.
        if (!(after < before && after > 0)) throw new Error(`expected width < ${before} and > 0, got ${after}`);
      });
    });

    it('keeps a handle from being dragged past the next handle', async () => {
      const before = paneWidth('test2');
      await ResizeHandleInteractor({ index: 1 }).dragTo(100000);
      await converge(() => {
        const after = paneWidth('test2');
        if (!(after < before && after > 0)) throw new Error(`expected width < ${before} and > 0, got ${after}`);
      });
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
      await until(() => {
        const shield = document.body.querySelector('[class^=dragShield]');
        return !!shield && getComputedStyle(shield).cursor === 'col-resize';
      });
    });

    it('keeps the mouse from reaching elements within the panes', async () => {
      const paneRect = document.querySelector('#dragPaneA').getBoundingClientRect();
      const x = paneRect.left + (paneRect.width / 2);
      const y = paneRect.top + (paneRect.height / 2);
      await until(() => document.elementFromPoint(x, y)?.className.startsWith('dragShield'));
    });

    it('removes the shield if the paneset unmounts mid-drag', async () => {
      await mountWithContext(<span>nothing</span>);
      await until(() => !document.body.querySelector('[class^=dragShield]'));
    });

    it('does not rerender resize context consumers on mouse movement', async () => {
      // let the renders caused by mousedown itself settle before taking the baseline.
      await new Promise((resolve) => { requestAnimationFrame(() => requestAnimationFrame(resolve)); });
      const rendersAfterMouseDown = consumerRenders;
      await ResizeHandleInteractor({ index: 0 }).moveTo(150);
      await ResizeHandleInteractor({ index: 0 }).moveTo(200);
      await ResizeHandleInteractor({ index: 0 }).moveTo(250);
      // give React (and the cursor's animation frame) a chance to flush anything the moves caused.
      await new Promise((resolve) => { requestAnimationFrame(() => requestAnimationFrame(resolve)); });
      await until(() => consumerRenders === rendersAfterMouseDown);
    });

    it('removes the shield on release', async () => {
      await ResizeHandleInteractor({ index: 0 }).endDrag();
      await until(() => !document.body.querySelector('[class^=dragShield]'));
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

    it('sets pane widths according to the initial layout', async () => {
      await until(() => document.querySelector('#resultPane').style.flex.includes('20%'));
      await until(() => document.querySelector('#detailPane').style.flex.includes('30%'));
    });
  });

  describe('handles not present when overlapped', () => {
    const modalToggle = Button('Toggle Overlapping Modal');
    const modalClose = Button('Close Modal');

    beforeEach(async () => {
      await mountWithContext(<PanesetHarness init={{ showDetail: true }} />);
      await modalToggle.click();
    });

    it('does not render resize handles when panes are overlapped', async () => {
      await resizeHandle.absent();
    });

    describe('When the overlapping element is closed', () => {
      beforeEach(async () => {
        await modalClose.click();
      });

      it('resize handles return', async () => {
        await resizeHandle.exists();
      });
    });
  });
});

describe('Pane Resize container interactions', () => {
  beforeEach(async () => {
    await mountWithContext(
      <Paneset id="clampSet">
        <Pane id="searchPane" paneTitle="search" defaultWidth="100px"><span>Content</span></Pane>
        <Pane id="resultPane" paneTitle="result" defaultWidth="300px"><span>Content</span></Pane>
        <Pane id="detailPane" paneTitle="detail" defaultWidth="200px"><span>Content</span></Pane>
        <Pane id="extraPane" paneTitle="extra" defaultWidth="fill"><span>Content</span></Pane>
        <ResizeControls />
      </Paneset>
    );
  });

  it('recomputes handles when the window is resized', async () => {
    window.dispatchEvent(new Event('resize'));
    await ResizeHandleInteractor({ index: 1 }).exists();
  });

  it('removes handles while resizing is suspended', async () => {
    await Button('suspend resizing').click();
    await ResizeHandleInteractor().absent();
  });

  it('restores handles when resizing resumes', async () => {
    await Button('suspend resizing').click();
    await Button('resume resizing').click();
    await ResizeHandleInteractor({ index: 1 }).exists();
  });

  it('updates handles on request', async () => {
    await Button('update handles').click();
    await ResizeHandleInteractor({ index: 1 }).exists();
  });
});
