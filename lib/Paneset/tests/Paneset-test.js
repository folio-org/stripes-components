import React from 'react';
import { describe, beforeEach, it, context } from 'mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';

import Paneset from '../Paneset';
import Pane from '../../Pane';
import PanesetHarness from './PanesetHarness';
import PanesetInteractor from './interactor';
import HarnessInteractor from './harnessInteractor';
import parseCSSUnit from '../../../util/parseCSSUnit';

describe('Paneset', () => {
  const paneset = new PanesetInteractor();
  const childPaneset = new PanesetInteractor('#childPaneset');
  const harness = new HarnessInteractor();

  beforeEach(async () => {
    await mountWithContext(
      <Paneset>
        <Pane defaultWidth="fill">Content</Pane>
        <Pane defaultWidth="100px">Pixel Content</Pane>
        <Pane defaultWidth="10%">Percent Content</Pane>
        <Pane defaultWidth="10rem">REM Content</Pane>
      </Paneset>
    );
  });

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
          <Pane defaultWidth="fill">Content</Pane>
          <Paneset defaultWidth="200px" id="childPaneset">
            <Pane defaultWidth="100px">Pixel Content</Pane>
            <Pane defaultWidth="10f">Percent Content</Pane>
            <Pane defaultWidth="10rem">REM Content</Pane>
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
});
