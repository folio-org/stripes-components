import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';
import pkg from '../package.json'

addons.setConfig({
  docs: {
    theme: Object.assign(
      themes.light,
      {
        brandTitle: `Stripes-Components v${pkg.version}`,
        brandUrl: 'https://github.com/folio-org/stripes-components'
      }
    )
  }
});
