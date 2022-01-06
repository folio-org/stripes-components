import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import { mountWithContext } from '../../../tests/helpers';
import PaneHeader from '../PaneHeader';
import PaneHeaderInteractor from './interactor';

const AppIconMock = () => <span data-test-pane-header-app-icon />;

describe('PaneHeader', () => {
  const paneHeader = new PaneHeaderInteractor();

  beforeEach(async () => {
    await mountWithContext(
      <PaneHeader
        paneTitle="My title"
        paneSub="My sub"
        id="my-id"
        dismissible
      />
    );
  });

  it('Should have an ID', () => {
    expect(paneHeader.id).to.equal('paneHeadermy-id');
  });

  it('Should render a pane sub', () => {
    expect(paneHeader.sub).to.equal('My sub');
  });

  it('Should render a pane title', () => {
    expect(paneHeader.title).to.equal('My title');
  });

  it('Should not render an app icon if no "appIcon"-prop is passed', () => {
    expect(paneHeader.appIcon.isPresent).to.equal(false);
  });

  it('Should not show the action menu dropdown if no "actionMenu"-prop is provided', () => {
    expect(paneHeader.actionsDropdown.isPresent).to.equal(false);
  });

  describe('If an <AppIcon> is passed', () => {
    beforeEach(async () => {
      await mountWithContext(
        <PaneHeader
          appIcon={<AppIconMock />} /* Mock icon since <AppIcon> now lives in stripes-core */
          paneTitle="My title"
          id="my-id"
          dismissible
        />
      );
    });

    it('Should render an app icon if the "appIcon"-prop is passed', () => {
      expect(paneHeader.appIcon.isPresent).to.equal(true);
    });
  });

  describe('If the dismissible-prop is true', () => {
    it('Should render a dismiss button', () => {
      expect(paneHeader.dismissButton.isPresent).to.equal(true);
    });

    it('Should have an aria-label of "Close {paneTitle}"', () => {
      expect(paneHeader.dismissButton.ariaLabel).to.equal('Close My title');
    });

    describe('If no paneTitle is passed', () => {
      beforeEach(async () => {
        await mountWithContext(
          <PaneHeader dismissible />
        );
      });

      it('Should have an aria-label of "Close"', () => {
        expect(paneHeader.dismissButton.ariaLabel).to.equal('Close ');
      });
    });
  });

  describe('If an actionMenu is passed', () => {
    beforeEach(async () => {
      await mountWithContext(
        <PaneHeader
          actionMenu={() => (
            <div>
              Action menu
            </div>
          )}
        />
      );

      await paneHeader.actionsButton.click();
    });

    it('Should render an "Actions"-button', () => {
      expect(paneHeader.actionsButton.isPresent).to.equal(true);
    });

    it('Should show the action menu dropdown on click', () => {
      expect(paneHeader.actionsDropdown.isOpen).to.equal('true');
    });
  });


  describe('If custom header is passed', () => {
    beforeEach(async () => {
      await mountWithContext(
        <PaneHeader
          header={<div>My custom header</div>}
        />
      );
    });

    it('Should render the custom header', () => {
      expect(paneHeader.customHeader.isPresent).to.equal(true);
    });
  });
});
