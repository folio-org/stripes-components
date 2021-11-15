import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import { StaticRouter as Router } from 'react-router-dom';

import { mount } from '../../../tests/helpers';
import PaneBackLink from '../PaneBackLink';
import PaneBackLinkInteractor from './interactor';

describe('PaneBackLink', () => {
  const paneBackLink = new PaneBackLinkInteractor();

  beforeEach(async () => {
    await mount(
      <Router context={{}}>
        <PaneBackLink to="/" />
      </Router>
    );
  });

  it('displays the back link', () => {
    expect(paneBackLink.$root).to.exist;
  });
});
