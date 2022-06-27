import React from 'react';

import { expect } from 'chai';
import sinon from 'sinon';
import { describe, beforeEach, it } from 'mocha';
import { HashRouter } from 'react-router-dom';
import { MessageBanner, converge } from '@folio/stripes-testing';
import { mountWithContext } from '../../../tests/helpers';
import ConflictDetectionBanner from '../ConflictDetectionBanner';
// import ConflictDetectionBannerInteractor from './interactor';

const ConflictDetectionBannerInteractor = MessageBanner.extend('conflict detection banner')
  .filters({
    message: (el) => el.querySelector('[class*=content---]').textContent,
    linkIcon: (el) => !!el.querySelector("[class*='icon-external-link'"),
    linkText: (el) => el.querySelector('[data-test-text-link]').textContent,
    linkHref: (el) => el.querySelector('[data-test-text-link]').getAttribute('href'),
  });

describe('ConflictDetectionBanner', () => {
  const banner = ConflictDetectionBannerInteractor();

  const message = 'This record cannot be saved because it is <strong>not</strong> the most recent version.View latest version';
  const link = 'test/path';

  const conflictDetectionBannerRef = React.createRef(null);

  const focusConflictDetectionBanner = sinon.spy();

  beforeEach(async () => {
    await mountWithContext(
      <HashRouter>
        <ConflictDetectionBanner
          latestVersionLink={link}
          conflictDetectionBannerRef={conflictDetectionBannerRef}
          focusConflictDetectionBanner={focusConflictDetectionBanner}
        />
      </HashRouter>
    );
  });

  it('should display the right message', () => banner.has({ message }));

  it('should display an "external-link" icon', () => banner.has({ linkIcon: true }));

  it('should have right href value for a link', () => banner.has({ linkHref: `#/${link}` }));

  it('should return a valid ref', () => {
    converge(() => conflictDetectionBannerRef.current !== null);
  });

  it('should have focusConflictDetectionBanner called', () => {
    converge(() => focusConflictDetectionBanner.called);
  });
});
