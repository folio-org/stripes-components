import React, { Component, Fragment } from 'react';
import { IntlProvider } from 'react-intl';
import pkg from '../package.json';
import { themes } from '@storybook/theming';
import IntlWrap from './IntlWrap';
import '../lib/global.css';

/**
 * React intl support
 */

// Load the locale data for all your defined locales
// import { setIntlConfig, withIntl } from 'storybook-addon-intl';

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
import ruTranslations from '../translations/stripes-components/ru.json';
import svTranslations from '../translations/stripes-components/sv.json';


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
  ru: prefixKeys(ruTranslations),
  sv: prefixKeys(svTranslations),
};

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

const storyFnDecorator = storyFn => (
  <IntlWrap messages={messages}>
    <AddOverlayContainer>
      {storyFn()}
    </AddOverlayContainer>
  </IntlWrap>
);

const preview = {
  decorators: [storyFnDecorator],
  parameters: {
    docs: {
      theme: Object.assign({}, themes.light, {
       brandTitle: `FOLIO Stripes-components v${pkg.version}`,
      })
    },
    readme: {
      codeTheme: 'a11y-dark',
    }
  }
}

export default preview;
