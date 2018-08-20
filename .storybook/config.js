import React, { Component, Fragment } from 'react';
import { configure, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { initializeRTL } from 'storybook-addon-rtl';
import '../lib/global.css';


/**
 * React intl support
 */

// Load the locale data for all your defined locales
import { setIntlConfig, withIntl } from 'storybook-addon-intl';

import daTranslations from '../translations/stripes-components/da.json';
import deTranslations from '../translations/stripes-components/de.json';
import enTranslations from '../translations/stripes-components/en.json';
import frTranslations from '../translations/stripes-components/fr.json';
import huTranslations from '../translations/stripes-components/hu.json';

import { addLocaleData } from 'react-intl';
import daLocaleData from 'react-intl/locale-data/da';
import deLocaleData from 'react-intl/locale-data/de';
import enLocaleData from 'react-intl/locale-data/en';
import frLocaleData from 'react-intl/locale-data/fr';
import huLocaleData from 'react-intl/locale-data/hu';

addLocaleData(daLocaleData);
addLocaleData(deLocaleData);
addLocaleData(enLocaleData);
addLocaleData(frLocaleData);
addLocaleData(huLocaleData);

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
  da: prefixKeys(daTranslations),
  de: prefixKeys(deTranslations),
  en: prefixKeys(enTranslations),
  fr: prefixKeys(frTranslations),
  hu: prefixKeys(huTranslations),
};

// Set intl configuration
setIntlConfig({
    locales: ['da', 'de', 'en', 'fr', 'hu'],
    defaultLocale: 'en',
    getMessages: (locale) => messages[locale]
});

addDecorator(withIntl);

/**
 * RTL
 */
initializeRTL();

/**
 * Add OverlayContainer to all stories
 * Popovers, Modals etc. mount to this element in the real system
 */

 class AddOverlayContainer extends Component {
  constructor(props) {
    super(props);
    const name = 'OverlayContainer';
    if (!document.getElementById('OverlayContainer')) {
      var OverlayContainerEl = document.createElement("div");
      OverlayContainerEl.id = name;
      document.body.appendChild(OverlayContainerEl);
    }
  }
  
  render() {
    return (
      <Fragment>
        {this.props.children}
      </Fragment>
    )
  }
 }

addDecorator(storyFn => <AddOverlayContainer>{storyFn()}</AddOverlayContainer>);

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
