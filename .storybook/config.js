import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import '../lib/global.css';

setOptions({
  name: 'FOLIO Stripes',
});

const req = require.context('../lib', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
