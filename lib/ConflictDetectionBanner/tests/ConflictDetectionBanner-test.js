import React from 'react';

import { expect } from 'chai';
import sinon from 'sinon';
import { describe, beforeEach, it } from 'mocha';
import { HashRouter } from 'react-router-dom';
import { mountWithContext } from '../../../tests/helpers';

import ConflictDetectionBanner from '../ConflictDetectionBanner';
import ConflictDetectionBannerInteractor from './interactor';

describe('ConflictDetectionBanner', () => {
  const conflictDetectionBanner = new ConflictDetectionBannerInteractor();

  const message = 'This record cannot be saved because it is <strong>not</strong> the most recent version.View latest version';
  const link = 'test/path';

  const conflictDetectionBannerRef = React.createRef();

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

  it('should display the right message', () => {
    expect(conflictDetectionBanner.messageBanner.text).to.equal(message);
  });

  it('should display an "external-link" icon', () => {
    expect(conflictDetectionBanner.externalLinkIcon.iconElement.className).to.include('icon-external-link');
  });

  it('should display a link', () => {
    expect(conflictDetectionBanner.link.tagName).to.equal('a');
  });

  it('should have right href value for a link', () => {
    expect(conflictDetectionBanner.link.href).to.equal(`#/${link}`);
  });

  it('should return a valid ref', () => {
    expect(conflictDetectionBannerRef.current).to.not.be.null;
  });

  it('should have focusConflictDetectionBanner called', () => {
    expect(focusConflictDetectionBanner.called).to.be.true;
  });
});
