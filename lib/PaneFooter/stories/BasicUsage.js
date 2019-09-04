/**
 * Pane: With PaneFooter component
 */

import React from 'react';
import { action } from '@storybook/addon-actions';
import Paneset from '../../Paneset';
import PaneFooter from '../PaneFooter';
import Pane from '../../Pane';
import Button from '../../Button';

export default () => {
  const footer = (
    <PaneFooter>
      <Button onClick={action('You clicked cancel')}>

        Cancel
      </Button>
      <Button
        buttonStyle="primary"
        onClick={action('You clicked save')}
      >

        Save
      </Button>
    </PaneFooter>
  );

  return (
    <div style={{ margin: '-1rem' }}>
      <Paneset>
        <Pane
          dismissible
          paneTitle="Pane with a footer"
          footer={footer}
        >

          Pane Content
        </Pane>
      </Paneset>
    </div>
  );
};
