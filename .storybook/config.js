import { configure, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import '../lib/global.css';

/**
 * Add mock context
 */
import withMockContext from './util/withMockContext';
addDecorator(withMockContext);

setOptions({
  name: 'FOLIO Stripes',
});

const req = require.context('../lib', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
