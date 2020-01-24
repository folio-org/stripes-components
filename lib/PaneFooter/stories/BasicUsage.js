/**
 * Pane: With PaneFooter component
 */

import React from 'react';
import { action } from '@storybook/addon-actions';
import PaneHeader from '../../PaneHeader';
import Paneset from '../../Paneset';
import PaneFooter from '../PaneFooter';
import Pane from '../../Pane';
import Button from '../../Button';

export default () => {
  const startButton = (
    <Button onClick={action('You clicked cancel')}>

      Cancel
    </Button>
  );

  const endButton = (
    <Button
      buttonStyle="primary"
      onClick={action('You clicked save')}
    >

    Save
    </Button>
  );

  const footer = (
    <PaneFooter
      renderStart={startButton}
      renderEnd={endButton}
    />
  );

  return (
    <div style={{ margin: '-1rem' }}>
      <Paneset>
        <Pane
          footer={footer}
          renderHeader={renderProps => (
            <PaneHeader
              {...renderProps}
              dismissible
              paneTitle="Pane with a footer"
            />
          )}
        >
          Pane Content
        </Pane>
      </Paneset>
    </div>
  );
};
