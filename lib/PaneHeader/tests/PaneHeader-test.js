import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { runAxeTest, HTML, IconButton as IconButtonInteractor, Dropdown as DropdownInteractor } from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import PaneHeader from '../PaneHeader';

const PaneHeaderInteractor = HTML.extend('pane header')
  .selector('[class^=paneHeader---]')
  .filters({
    title: (el) => el.querySelector('[class^=paneTitleLabel]').textContent,
    sub: (el) => el.querySelector('[class^=paneSub---]').textContent,
  });

const AppIcon = HTML.extend('app icon')
  .selector('[data-test-pane-header-app-icon]');

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

  it('Should have an ID', () => paneHeader.has({ id: 'paneHeadermy-id' }));

  it('Should render a pane sub', () => paneHeader.has({ sub: 'My sub' }));

  it('Should render a pane title', () => paneHeader.has({ title: 'My title' }));

  it('contains no axe errors - PaneHeader', runAxeTest);

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

    it('Should render an app icon if the "appIcon"-prop is passed', () => AppIcon({ visible: false }).exists());
  });

  describe('If the dismissible-prop is true', () => {
    it('Should render a dismiss button', () => IconButtonInteractor({ icon: 'times' }).exists());

    it('Should have an aria-label of "Close {paneTitle}"', () => IconButtonInteractor('Close My title').exists());

    describe('If no paneTitle is passed', () => {
      beforeEach(async () => {
        await mountWithContext(
          <PaneHeader dismissible />
        );
      });

      it('Should have an aria-label of "Close"', () => IconButtonInteractor('Close ').exists());
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

      await DropdownInteractor('Actions').open();
    });

    it('Should render an "Actions"-button', () => DropdownInteractor('Actions').exists());

    it('Should show the action menu dropdown on click', () => DropdownInteractor().is({ open: true }));
  });


  describe('If custom header is passed', () => {
    beforeEach(async () => {
      await mountWithContext(
        <PaneHeader
          header={<div>My custom header</div>}
        />
      );
    });

    it('Should render the custom header', () => HTML('My custom header').exists());
  });
});
