import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import { StaticRouter as Router } from 'react-router-dom';

import { mount } from '../../../tests/helpers';
import PaneCloseLink from '../PaneCloseLink';
import PaneCloseLinkInteractor from './interactor';

describe('PaneCloseLink', () => {
  const paneCloseLink = new PaneCloseLinkInteractor();

  beforeEach(async () => {
    await mount(
      <Router context={{}}>
        <PaneCloseLink to="/" />
      </Router>
    );
  });

  it('displays the close link', () => {
    expect(paneCloseLink.$root).to.exist;
  });
});
