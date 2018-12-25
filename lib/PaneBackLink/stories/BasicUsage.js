/**
 * PaneBackLink: Basic Usage
 */

import React from 'react';
import { MemoryRouter } from 'react-router'; /* eslint-disable-line import/no-extraneous-dependencies */
import Paneset from '../../Paneset';
import PaneBackLink from '../PaneBackLink';
import Pane from '../../Pane';

const BasicUsage = () => (
  <div style={{ margin: '-1rem' }}>
    <MemoryRouter>
      <Paneset>
        <Pane defaultWidth="fill" paneTitle="PaneBackLink example" firstMenu={<PaneBackLink to="/some-url" />}>
          Resize the screen until the {'<PaneBackLink>'} appears.
        </Pane>
      </Paneset>
    </MemoryRouter>
  </div>
);

export default BasicUsage;
