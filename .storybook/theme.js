import { create } from '@storybook/theming/create';
import pkg from '../package.json';

export default create({
  base: 'light',
  brandTitle: `Stripes-Components v${pkg.version}`,
  brandUrl: 'https://github.com/folio-org/stripes-components',
});