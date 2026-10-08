import React from 'react';
import { describe, beforeEach, it, context } from 'mocha';
import { expect } from 'chai';
import { Button, HTML, including, not, runAxeTest } from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import Paneset from '../Paneset';
import Pane from '../../Pane';
import PanesetHarness from './PanesetHarness';
import paneCss from '../../Pane/Pane.css';
import parseCSSUnit from '../../../util/parseCSSUnit';


function title(el) { return el.querySelector('[class^=paneTitle]').textContent; }

const PaneStyleInteractor = HTML.extend('Pane')
  .selector('section[class^=pane]')
  .locator(title)
  .filters({
    widthStyle: (el) => el.style.flex
  });

const PanesetInteractor = HTML.extend('Paneset')
  .selector('[class*=paneset---]')
  .filters({
    paneCount: (el) => el.querySelectorAll(`.${paneCss.pane}`).length,
  });

const ChildPanesetInteractor = HTML.extend('child Paneset')
  .selector('[class*=paneset---] [class*=paneset---]');

const TestElementInteractor = HTML.extend('test element')
  .selector('[data-test]');

const ChildStatusInteractor = HTML.extend('child status')
  .selector('[data-test-child-item]')
  .filters({
    index: (el) => [...el.parentNode.children].indexOf(el),
  });

describe('Paneset', () => {
  const paneset = PanesetInteractor();
  const childPaneset = PanesetInteractor({ id: 'childPaneset' });
  const toggleSearch = Button({ id: 'toggle-search' });
  const toggleDetails = Button({ id: 'toggle-detail' });
  const toggleWidth = Button({ id: 'toggle-width' });
  const inspectAction = Button({ id: 'inspect-children' });

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
    return paneset.exists();
  });

  it('renders child panes', () => {
    return paneset.has({ paneCount: 4 });
  });

  describe('Testable Paneset', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Paneset data-test />
      );
    });

    it('has a "data-test" attribute', () => {
      return TestElementInteractor().exists();
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
      return childPaneset.exists();
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
      return paneset.exists();
    });

    it('renders child panes', () => {
      return paneset.has({ paneCount: 3 });
    });

    describe('hiding the search pane', () => {
      beforeEach(async () => {
        await toggleSearch.click();
        await inspectAction.click();
      });

      it('renders 2 panes', () => {
        return paneset.has({ paneCount: 2 });
      });

      it('2nd and 3rd pane registered', async () => {
        await ChildStatusInteractor({ index: 0 }).has({ text: 'false' });
        await ChildStatusInteractor({ index: 1 }).has({ text: 'true' });
        await ChildStatusInteractor({ index: 2 }).has({ text: 'true' });
      });

      describe('hiding the detail pane', () => {
        beforeEach(async () => {
          await toggleDetails.click();
          await inspectAction.click();
        });

        it('renders 1 pane', () => {
          return paneset.has({ paneCount: 1 });
        });

        it('Only 2nd Pane registered', async () => {
          await ChildStatusInteractor({ index: 0 }).has({ text: 'false' });
          await ChildStatusInteractor({ index: 1 }).has({ text: 'true' });
          await ChildStatusInteractor({ index: 2 }).has({ text: 'false' });
        });

        describe('showing the detail pane again', () => {
          beforeEach(async () => {
            await toggleDetails.click();
            await inspectAction.click();
          });

          it('renders 2 panes', () => {
            return paneset.has({ paneCount: 2 });
          });

          it('1st and 2nd pane registered', async () => {
            await ChildStatusInteractor({ index: 0 }).has({ text: 'false' });
            await ChildStatusInteractor({ index: 1 }).has({ text: 'true' });
            await ChildStatusInteractor({ index: 2 }).has({ text: 'true' });
          });

          describe('showing the search pane again', () => {
            beforeEach(async () => {
              await toggleSearch.click();
            });

            it('renders 3 panes', () => {
              return paneset.has({ paneCount: 3 });
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
        return inspectAction.exists();
      });

      describe('perform resize', () => {
        beforeEach(async () => {
          await toggleWidth.click();
        });

        it('still renders', async () => {
          await inspectAction.exists();
          await ChildPanesetInteractor().exists();
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
