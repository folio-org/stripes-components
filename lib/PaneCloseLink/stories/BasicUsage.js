/**
 * PaneCloseLink: Basic Usage
 */

import React from 'react';
import { MemoryRouter } from 'react-router'; /* eslint-disable-line import/no-extraneous-dependencies */
import PaneHeader from '../../PaneHeader';
import Paneset from '../../Paneset';
import PaneCloseLink from '../PaneCloseLink';
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
              paneTitle="PaneCloseLink example"
              firstMenu={<PaneCloseLink to="/some-url" />}
            />
          )}
        >
          Resize the screen to see the
          {' <PaneCloseLink>'}
          -icon transform from a times to an arrow-left.
        </Pane>
      </Paneset>
    </MemoryRouter>
  </div>
);

export default BasicUsage;
