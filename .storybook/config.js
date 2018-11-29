import React, { Component, Fragment } from 'react';
import { configure, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { initializeRTL } from 'storybook-addon-rtl';
import 'typeface-source-sans-pro';
import '../lib/global.css';


/**
 * React intl support
 */

// Load the locale data for all your defined locales
import { setIntlConfig, withIntl } from 'storybook-addon-intl';

import arTranslations from '../translations/stripes-components/ar.json';
import caTranslations from '../translations/stripes-components/ca.json';
import daTranslations from '../translations/stripes-components/da.json';
import deTranslations from '../translations/stripes-components/de.json';
import enTranslations from '../translations/stripes-components/en.json';
import esTranslations from '../translations/stripes-components/es.json';
import frTranslations from '../translations/stripes-components/fr.json';
import huTranslations from '../translations/stripes-components/hu.json';
import itTranslations from '../translations/stripes-components/it_IT.json';
import ptTranslations from '../translations/stripes-components/pt_BR.json';

import { addLocaleData } from 'react-intl';
import arLocaleData from 'react-intl/locale-data/ar';
import caLocaleData from 'react-intl/locale-data/ca';
import daLocaleData from 'react-intl/locale-data/da';
import deLocaleData from 'react-intl/locale-data/de';
import enLocaleData from 'react-intl/locale-data/en';
import esLocaleData from 'react-intl/locale-data/es';
import frLocaleData from 'react-intl/locale-data/fr';
import huLocaleData from 'react-intl/locale-data/hu';
import itLocaleData from 'react-intl/locale-data/it';
import ptLocaleData from 'react-intl/locale-data/pt';

addLocaleData(arLocaleData);
addLocaleData(caLocaleData);
addLocaleData(daLocaleData);
addLocaleData(deLocaleData);
addLocaleData(enLocaleData);
addLocaleData(esLocaleData);
addLocaleData(frLocaleData);
addLocaleData(huLocaleData);
addLocaleData(itLocaleData);
addLocaleData(ptLocaleData);

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
  ar: prefixKeys(arTranslations),
  ca: prefixKeys(caTranslations),
  da: prefixKeys(daTranslations),
  de: prefixKeys(deTranslations),
  en: prefixKeys(enTranslations),
  es: prefixKeys(esTranslations),
  fr: prefixKeys(frTranslations),
  hu: prefixKeys(huTranslations),
  it: prefixKeys(itTranslations),
  pt: prefixKeys(ptTranslations),
};

// Set intl configuration
setIntlConfig({
    locales: ['ar', 'ca', 'da', 'de', 'en', 'es', 'fr', 'hu', 'it', 'pt'],
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
