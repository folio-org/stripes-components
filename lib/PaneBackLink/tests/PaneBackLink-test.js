import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { StaticRouter as Router } from 'react-router-dom';
import { runAxeTest, HTML } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';
import PaneBackLink from '../PaneBackLink';

const interactor = HTML.extend('pane back link')
  .selector('[class*=paneBackLink---]');


describe('PaneBackLink', () => {
  const paneBackLink = interactor({ visible: false });

  beforeEach(async () => {
    await mount(
      <Router context={{}}>
        <PaneBackLink to="/" />
      </Router>
    );
  });

  it('contains no axe errors - PaneBackLink', runAxeTest);

  it('displays the back link', () => paneBackLink.exists());
});
