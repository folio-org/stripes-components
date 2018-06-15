import { configure, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import '../lib/global.css';


/**
 * React intl support
 */

// Load the locale data for all your defined locales
import { setIntlConfig, withIntl } from 'storybook-addon-intl';
import enTranslations from '../translations/stripes-components/en.json';
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
addLocaleData(enLocaleData);

// mimics the StripesTranslationPlugin in @folio/stripes-core
function prefixKeys(obj) {
  const res = {};
  for (const key of Object.keys(obj)) {
    res[`stripes-components.${key}`] = obj[key];
  }
  return res;
}

// Define messages
const messages = {
  en: prefixKeys(enTranslations),
};

// Set intl configuration
setIntlConfig({
    locales: ['en'],
    defaultLocale: 'en',
    getMessages: (locale) => messages[locale]
});

addDecorator(withIntl);

/**
 * Set options
 */
setOptions({
  name: 'FOLIO Stripes',
});

const req = require.context('../lib', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
