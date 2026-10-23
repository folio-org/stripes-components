import React from 'react';
import { describe, beforeEach, it, context } from 'mocha';
import { expect } from 'chai';
import { HTML, converge, including, not, runAxeTest } from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import Paneset from '../Paneset';
import Pane from '../../Pane';
import PanesetHarness from './PanesetHarness';
import PanesetInteractor from './interactor';
import HarnessInteractor from './harnessInteractor';
import parseCSSUnit from '../../../util/parseCSSUnit';


function title(el) { return el.querySelector('[class^=paneTitle]').textContent; }

const PaneStyleInteractor = HTML.extend('Pane')
  .selector('section[class^=pane]')
  .locator(title)
  .filters({
    widthStyle: (el) => el.style.flex,
    width: (el) => el.offsetWidth,
  });

// converge() only retries while its callback throws, so a falsy return value would pass immediately.
const until = (condition) => converge(() => {
  if (!condition()) throw new Error(`condition not met: ${condition}`);
});

const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

describe('Paneset', () => {
  const paneset = new PanesetInteractor();
  const childPaneset = new PanesetInteractor('#childPaneset');
  const harness = new HarnessInteractor();

  beforeEach(async () => {
    await mountWithContext(
      <Paneset>
        <Pane defaultWidth="fill" paneTitle="Content" id="first">Content</Pane>
        <Pane defaultWidth="100px" paneTitle="Px Size" id="second">Pixel Content</Pane>
        <Pane defaultWidth="10%" paneTitle="Percent Size" id="third">Percent Content</Pane>
        <Pane defaultWidth="10rem" paneTitle="REM Size" id="fourth">REM Content</Pane>
      </Paneset>
    );
  });

  it('contains no axe errors - Paneset', runAxeTest);

  it('renders paneset', () => {
    expect(paneset.isPresent).to.be.true;
  });

  it('renders child panes', () => {
    expect(paneset.panes().length).to.equal(4);
  });

  describe('Testable Paneset', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Paneset data-test />
      );
    });

    it('has a "data-test" attribute', () => {
      expect(paneset.testElement.isPresent).to.be.true;
    });
  });

  describe('Child Paneset', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Paneset>
          <Pane defaultWidth="fill" id="parentfirst">Content</Pane>
          <Paneset defaultWidth="200px" id="childPaneset">
            <Pane defaultWidth="100px" id="childfirst">Pixel Content</Pane>
            <Pane defaultWidth="10f" id="childsecond">Percent Content</Pane>
            <Pane defaultWidth="10rem" id="childthird">REM Content</Pane>
          </Paneset>
        </Paneset>
      );
    });

    it('renders the child paneset', () => {
      expect(childPaneset.isPresent).to.be.true;
    });

    context('tesing parseCSSUnit', () => {
      it('correctly parses px CSS strings', () => {
        expect(parseCSSUnit('15px')).to.equal('px');
      });
      it('correctly parses rem CSS strings', () => {
        expect(parseCSSUnit('15rem')).to.equal('rem');
      });
      it('correctly parses em CSS strings', () => {
        expect(parseCSSUnit('15em')).to.equal('em');
      });
      it('correctly parses vw CSS strings', () => {
        expect(parseCSSUnit('15vw')).to.equal('vw');
      });
      it('parses unknown CSS strings as percent', () => {
        expect(parseCSSUnit('15monkeybagel')).to.equal('percent');
      });
    });
  });

  describe('pane registration/removal', () => {
    beforeEach(async () => {
      await mountWithContext(
        <PanesetHarness />
      );
    });

    it('renders a paneset', () => {
      expect(paneset.isPresent).to.be.true;
    });

    it('renders child panes', () => {
      expect(paneset.panes().length).to.equal(3);
    });

    describe('hiding the search pane', () => {
      beforeEach(async () => {
        await harness.toggleSearch.click();
        await harness.inspectAction.click();
      });

      it('renders 2 panes', () => {
        expect(paneset.panes().length).to.equal(2);
      });

      it('2nd and 3rd pane registered', () => {
        expect(harness.childrenStatus(0).text).to.equal('false');
        expect(harness.childrenStatus(1).text).to.equal('true');
        expect(harness.childrenStatus(2).text).to.equal('true');
      });

      describe('hiding the detail pane', () => {
        beforeEach(async () => {
          await harness.toggleDetails.click();
          await harness.inspectAction.click();
        });

        it('renders 1 pane', () => {
          expect(paneset.panes().length).to.equal(1);
        });

        it('Only 2nd Pane registered', () => {
          expect(harness.childrenStatus(0).text).to.equal('false');
          expect(harness.childrenStatus(1).text).to.equal('true');
          expect(harness.childrenStatus(2).text).to.equal('false');
        });

        describe('showing the detail pane again', () => {
          beforeEach(async () => {
            await harness.toggleDetails.click();
            await harness.inspectAction.click();
          });

          it('renders 2 panes', () => {
            expect(paneset.panes().length).to.equal(2);
          });

          it('1st and 2nd pane registered', () => {
            expect(harness.childrenStatus(0).text).to.equal('false');
            expect(harness.childrenStatus(1).text).to.equal('true');
            expect(harness.childrenStatus(2).text).to.equal('true');
          });

          describe('showing the search pane again', () => {
            beforeEach(async () => {
              await harness.toggleSearch.click();
            });

            it('renders 3 panes', () => {
              expect(paneset.panes().length).to.equal(3);
            });
          });
        });
      });
    });

    describe('test viewport resize', () => {
      beforeEach(async () => {
        await mountWithContext(
          <PanesetHarness childPaneset />
        );
      });

      it('should render', () => {
        expect(harness.inspectAction.isPresent).to.be.true;
      });

      describe('perform resize', () => {
        beforeEach(async () => {
          await harness.toggleWidth.click();
        });

        it('still renders', () => {
          expect(harness.inspectAction.isPresent).to.be.true;
          expect(harness.paneset.childPanesets(0).$root.style).to.not.be.null;
        });
      });
    });
  });

  describe('paneset does not affect percentage-based panes on resize', () => {
    beforeEach(async () => {
      const layouts = [
        {
          'filter-pane': '20%',
          'results-pane': '80%',
        },
      ];
      await mountWithContext(
        <Paneset initialLayouts={layouts}>
          <Pane
            paneTitle="Filter pane"
            defaultWidth="20%"
            id="filter-pane"
          >
            <p>Filter Pane content.</p>
          </Pane>
          <Pane
            paneTitle="Results pane"
            defaultWidth="80%"
            id="results-pane"
          >
            <p>Results Pane content.</p>
          </Pane>
        </Paneset>
      );
    });

    it('sizes remain at their set percentages - filter pane 20%', async () => {
      await PaneStyleInteractor('Filter pane').has({ widthStyle: including('20%') });
    });
  });

  describe('paneset does not affect percentage-based panes on resize', () => {
    beforeEach(async () => {
      const layouts = [
        {
          'filter-pane': '20%',
          'results-pane': '80%',
        },
        {
          'filter-pane': '20%',
          'results-pane': '30%',
          'detail-pane': '40%',
        }
      ];
      await mountWithContext(
        <Paneset initialLayouts={layouts}>
          <Pane
            paneTitle="Filter pane"
            defaultWidth="20%"
            id="filter-pane"
          >
            <p>Filter Pane content.</p>
          </Pane>
          <Pane
            paneTitle="Results pane"
            defaultWidth="30%"
            id="results-pane"
          >
            <p>Results Pane content.</p>
          </Pane>
          <Pane
            paneTitle="Detail pane"
            defaultWidth="40%"
            id="detail-pane"
          >
            <p>Results Pane content.</p>
          </Pane>
        </Paneset>
      );
    });

    it('sizes remain at their set percentages - detail pane 50%', async () => {
      await PaneStyleInteractor('Detail pane').has({ widthStyle: including('50%') });
    });
  });

  describe('paneset only affects pixel-based panes widths on resize', () => {
    beforeEach(async () => {
      const layouts = [
        {
          'filter-pane': '100px',
          'results-pane': '50%',
        },
      ];
      await mountWithContext(
        <Paneset id="pixel-test" initialLayouts={layouts}>
          <Pane
            paneTitle="Filter pane"
            defaultWidth="100px"
            id="filter-pane"
          >
            <p>Filter Pane content.</p>
          </Pane>
          <Pane
            paneTitle="Results pane"
            defaultWidth="50%"
            id="results-pane"
          >
            <p>Results Pane content.</p>
          </Pane>
        </Paneset>
      );
    });

    it('percentage pane remains - results pane at 50%', async () => {
      await PaneStyleInteractor('Results pane').has({ widthStyle: including('50%') });
    });

    it('px pane is adjusted - filter pane not still 100px', async () => {
      await PaneStyleInteractor('Filter pane').has({ widthStyle: not(including('100px')) });
    });
  });
});

describe('Paneset instance behavior', () => {
  let paneset;

  beforeEach(() => {
    paneset = React.createRef();
  });

  describe('onLayout override', () => {
    let calls;

    beforeEach(async () => {
      calls = [];
      const onLayout = (args) => {
        calls.push(args);
        return { a: '30%', b: '70%' };
      };
      await mountWithContext(
        <Paneset onLayout={onLayout}>
          <Pane id="a" paneTitle="Pane A" defaultWidth="fill">A</Pane>
          <Pane id="b" paneTitle="Pane B" defaultWidth="fill">B</Pane>
        </Paneset>
      );
    });

    it('is called with the type of change', async () => {
      await until(() => calls.some((c) => c.changeType === 'added'));
    });

    it('applies the widths it returns', async () => {
      await PaneStyleInteractor('Pane A').has({ widthStyle: including('30%') });
      await PaneStyleInteractor('Pane B').has({ widthStyle: including('70%') });
    });
  });

  describe('onResize callback', () => {
    let resizeCalls;

    beforeEach(async () => {
      resizeCalls = [];
      await mountWithContext(
        <Paneset onResize={(args) => resizeCalls.push(args)}>
          <Pane id="a" paneTitle="Pane A" defaultWidth="200px">A</Pane>
          <Pane id="b" paneTitle="Pane B" defaultWidth="fill">B</Pane>
        </Paneset>
      );
    });

    it('is called when all panes have explicit ids', async () => {
      await until(() => resizeCalls.length > 0);
      expect(Object.keys(resizeCalls[0].currentLayout)).to.have.members(['a', 'b']);
    });
  });

  describe('onResize callback with generated pane ids', () => {
    let resizeCalls;

    beforeEach(async () => {
      resizeCalls = [];
      await mountWithContext(
        <Paneset onResize={(args) => resizeCalls.push(args)}>
          <Pane paneTitle="Pane A" defaultWidth="200px">A</Pane>
          <Pane paneTitle="Pane B" defaultWidth="fill">B</Pane>
        </Paneset>
      );
    });

    it('is not called', async () => {
      await PaneStyleInteractor('Pane A').exists();
      await sleep(200);
      expect(resizeCalls.length).to.equal(0);
    });
  });

  describe('pane removal and registration lookups', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Paneset ref={paneset}>
          <Pane id="a" paneTitle="Pane A" defaultWidth="fill">A</Pane>
          <Pane id="b" paneTitle="Pane B" defaultWidth="200px">B</Pane>
        </Paneset>
      );
      await until(() => paneset.current.isRegistered('b'));
    });

    it('reports registered and unregistered panes', () => {
      expect(paneset.current.isRegistered('a')).to.be.true;
      expect(paneset.current.isRegistered('nope')).to.be.false;
    });

    it('returns its own element as the topmost container', () => {
      expect(paneset.current.getTopmostContainer()).to.equal(paneset.current.getContainer());
    });

    it('closes a pane without transition and fires the callback immediately', () => {
      let closed = false;
      paneset.current.handleClose('b', () => { closed = true; });
      expect(closed).to.be.true;
    });

    it('closes a pane without a callback', () => {
      expect(() => paneset.current.handleClose('b')).to.not.throw();
    });
  });

  describe('panes that transition', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Paneset ref={paneset}>
          <Pane id="a" paneTitle="Pane A" defaultWidth="fill">A</Pane>
          <Pane id="slider" paneTitle="Slider" defaultWidth="200px" transition="slide">S</Pane>
        </Paneset>
      );
      await until(() => paneset.current.isRegistered('slider'));
    });

    it('renders the sliding pane', async () => {
      await PaneStyleInteractor('Slider').exists();
    });

    it('fires the close callback after the transition', async () => {
      let closed = false;
      paneset.current.handleClose('slider', () => { closed = true; });
      expect(closed).to.be.false;
      await until(() => closed === true);
    });

    it('closes without a callback', () => {
      expect(() => paneset.current.handleClose('slider')).to.not.throw();
    });
  });

  describe('nested panesets', () => {
    let child;

    beforeEach(async () => {
      child = React.createRef();
      await mountWithContext(
        <Paneset ref={paneset} id="outer">
          <Pane id="a" paneTitle="Pane A" defaultWidth="300px">A</Pane>
          <Paneset ref={child} id="inner">
            <Pane id="c1" paneTitle="Child 1" defaultWidth="100px">1</Pane>
            <Pane id="c2" paneTitle="Child 2" defaultWidth="fill">2</Pane>
          </Paneset>
        </Paneset>
      );
      await until(() => paneset.current.isRegistered('inner') && child.current.isRegistered('c2'));
    });

    it('resolves the topmost container through the parent', () => {
      expect(child.current.getTopmostContainer()).to.equal(paneset.current.getContainer());
    });

    it('sums the widths of nested child panes', () => {
      const nested = paneset.current.getChildPanesTotalWidth();
      const own = child.current.getChildPanesTotalWidth();
      expect(own).to.be.greaterThan(0);
      expect(nested).to.be.greaterThan(own);
    });

    it('resizes nested panesets with the parent', async () => {
      paneset.current.resizeToContainer();
      await until(() => !paneset.current.resizeNestedTO);
      await PaneStyleInteractor('Child 1').exists();
    });

    it('applies handle positions to its panes and its nested paneset', async () => {
      paneset.current.handlePaneResize({
        positions: [
          { id: 'h-a', elementId: 'a', x: 0 },
          { id: 'h-c1', elementId: 'c1', x: 250 },
          { id: 'h-c2', elementId: 'c2', x: 350 },
        ],
        containerRect: { width: 600 },
      });
      await PaneStyleInteractor('Pane A').has({ widthStyle: including('250px') });
    });
  });

  describe('resizing positions directly', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Paneset ref={paneset}>
          <Pane id="a" paneTitle="Pane A" defaultWidth="fill">A</Pane>
          <Pane id="b" paneTitle="Pane B" defaultWidth="fill">B</Pane>
        </Paneset>
      );
      await until(() => paneset.current.isRegistered('b'));
    });

    it('sizes panes from handle positions', async () => {
      paneset.current.handlePaneResize({
        positions: [
          { id: 'h-a', elementId: 'a', x: 0 },
          { id: 'h-b', elementId: 'b', x: 120 },
        ],
        containerRect: { width: 400 },
      });
      await PaneStyleInteractor('Pane A').has({ widthStyle: including('120px') });
      await PaneStyleInteractor('Pane B').has({ widthStyle: including('280px') });
    });

    it('does not resize panes when widths are null', () => {
      expect(() => paneset.current.resizePanes([], null)).to.not.throw();
    });
  });

  describe('window resizing', () => {
    describe('with cached layouts in assorted units', () => {
      beforeEach(async () => {
        const layouts = [{
          a: '10em',
          b: '10rem',
          c: '10vw',
          d: '150px',
          e: '20%',
        }];
        await mountWithContext(
          <Paneset ref={paneset} initialLayouts={layouts}>
            <Pane id="a" paneTitle="Pane A" defaultWidth="10em">A</Pane>
            <Pane id="b" paneTitle="Pane B" defaultWidth="10rem">B</Pane>
            <Pane id="c" paneTitle="Pane C" defaultWidth="10vw">C</Pane>
            <Pane id="d" paneTitle="Pane D" defaultWidth="150px">D</Pane>
            <Pane id="e" paneTitle="Pane E" defaultWidth="20%">E</Pane>
          </Paneset>
        );
        await until(() => paneset.current.isRegistered('e'));
      });

      it('keeps em-based cached widths as-is on mount', async () => {
        await PaneStyleInteractor('Pane A').has({ widthStyle: including('10em') });
      });

      it('rescales cached sizes in every unit when resized', async () => {
        await until(() => paneset.current.getChildPanesTotalWidth() > 0);
        paneset.current.resizeToContainer();
        await until(() => !paneset.current.resizeNestedTO);
        await PaneStyleInteractor('Pane D').exists();
      });

      it('responds to the window resize event', async () => {
        await until(() => paneset.current.getChildPanesTotalWidth() > 0);
        window.dispatchEvent(new Event('resize'));
        await sleep(150); // listener is debounced by 50ms
        await PaneStyleInteractor('Pane E').exists();
      });
    });

    describe('with panes that have no cached layout', () => {
      beforeEach(async () => {
        await mountWithContext(
          <Paneset ref={paneset}>
            <Pane id="a" paneTitle="Pane A" defaultWidth="200px">A</Pane>
            <Pane id="b" paneTitle="Pane B" defaultWidth="fill">B</Pane>
          </Paneset>
        );
        await until(() => paneset.current.isRegistered('b'));
        // forget the cached layout so that the uncached branch runs.
        paneset.current.setState({ layoutCache: [] });
      });

      it('resizes to the container', async () => {
        paneset.current.resizeToContainer();
        await until(() => !paneset.current.resizeNestedTO);
        await PaneStyleInteractor('Pane B').exists();
      });

      it('resizes only nested panesets when panes already fill the container', async () => {
        paneset.current.getChildPanesTotalWidth = () => window.innerWidth;
        paneset.current.resizeToContainer();
        await until(() => !paneset.current.resizeNestedTO);
        await PaneStyleInteractor('Pane A').exists();
      });
    });

    describe('when the paneset has unmounted', () => {
      beforeEach(async () => {
        await mountWithContext(
          <Paneset ref={paneset}>
            <Pane id="a" paneTitle="Pane A" defaultWidth="fill">A</Pane>
          </Paneset>
        );
        await until(() => paneset.current.isRegistered('a'));
      });

      it('ignores resize requests', async () => {
        const instance = paneset.current;
        await mountWithContext(<span>nothing</span>);
        expect(() => instance.resizeToContainer()).to.not.throw();
        expect(instance.isThisMounted()).to.be.false;
      });
    });
  });
});
