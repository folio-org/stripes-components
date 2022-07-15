import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import { StaticRouter as Router } from 'react-router-dom';
import { runAxeTest } from '@folio/stripes-testing';

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

  it('contains no axe errors - PaneCloseLink', runAxeTest);

  it('displays the close link', () => {
    expect(paneCloseLink.$root).to.exist;
  });
});
