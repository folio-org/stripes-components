/**
 * PaneCloseLink: Basic Usage
 */

import React from 'react';
import { MemoryRouter } from 'react-router'; /* eslint-disable-line import/no-extraneous-dependencies */
import faker from 'faker';
import Paneset from '../../Paneset';
import Pane from '../../Pane';
import PaneSubheader from '../PaneSubheader';
import MessageBanner from '../../MessageBanner';


const PaneSubheaderExample = () => {
  const subheader = (
    <PaneSubheader>
      <MessageBanner type="error">Render error messages in a subheader!</MessageBanner>
    </PaneSubheader>
  );

  return (
    <div style={{ margin: '-1rem' }}>
      <MemoryRouter>
        <Paneset>
          <Pane defaultWidth="50%" paneTitle="PaneSubheader example" subheader={subheader}>
            <h3>Pane content renders below header</h3>
            <p>
              {faker.lorem.paragraphs(10)}
            </p>
            <p>
              {faker.lorem.paragraphs(10)}
            </p>
          </Pane>
        </Paneset>
      </MemoryRouter>
    </div>
  );
};

export default PaneSubheaderExample;
