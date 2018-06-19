import { configure, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { initializeRTL } from 'storybook-addon-rtl';
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

// Define messages
const messages = {
  en: enTranslations,
};

// Set intl configuration
setIntlConfig({
    locales: ['en'],
    defaultLocale: 'en',
    getMessages: (locale) => messages[locale]
});

addDecorator(withIntl);

initializeRTL();

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
