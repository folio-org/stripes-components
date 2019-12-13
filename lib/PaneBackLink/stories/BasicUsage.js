/**
 * PaneBackLink: Basic Usage
 */

import React from 'react';
import { MemoryRouter } from 'react-router'; /* eslint-disable-line import/no-extraneous-dependencies */
import Paneset from '../../Paneset';
import PaneHeader from '../../PaneHeader';
import PaneBackLink from '../PaneBackLink';
import Pane from '../../Pane';

const BasicUsage = () => (
  <div style={{ margin: '-1rem' }}>
    <MemoryRouter>
      <Paneset>
        <Pane
          defaultWidth="fill"
          renderHeader={renderProps => (
            <PaneHeader
              {...renderProps}
              paneTitle="PaneBackLink example"
              firstMenu={<PaneBackLink to="/some-url" />}
            />
          )}
        >
          Resize the screen until the
          {' '}
          <code>{'<PaneBackLink>'}</code>
          {' '}
          appears.
        </Pane>
      </Paneset>
    </MemoryRouter>
  </div>
);

export default BasicUsage;
