import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { StaticRouter as Router } from 'react-router-dom';
import { runAxeTest, HTML } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';
import PaneCloseLink from '../PaneCloseLink';

const interactor = HTML.extend('pane back link')
  .selector('[class*=paneCloseLink---]');

describe('PaneCloseLink', () => {
  const paneCloseLink = interactor();

  beforeEach(async () => {
    await mount(
      <Router context={{}}>
        <PaneCloseLink to="/" />
      </Router>
    );
  });

  it('contains no axe errors - PaneCloseLink', runAxeTest);

  it('displays the close link', () => paneCloseLink.exists());
});
