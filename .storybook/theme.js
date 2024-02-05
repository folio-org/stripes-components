import { create } from '@storybook/theming/create';
import pkg from '../package.json';

// Setting up this 'theme' renders the library version in the storybook UI.

export default create({
  base: 'light',
  brandTitle: `Stripes-Components v${pkg.version}`,
  brandUrl: 'https://github.com/folio-org/stripes-components',
});