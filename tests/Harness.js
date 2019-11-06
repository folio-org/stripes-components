import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { reducer as formReducer } from 'redux-form';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import translations from '../translations/stripes-components/en';

const reducers = {
  form: formReducer,
};

const reducer = combineReducers(reducers);

const store = createStore(reducer);

// mimics the StripesTranslationPlugin in @folio/stripes-core
function prefixKeys(obj, prefix) {
  const res = {};
  for (const key of Object.keys(obj)) {
    res[`${prefix}.${key}`] = obj[key];
  }
  return res;
}

class Harness extends React.Component {
  render() {
    const t = prefixKeys(translations, 'stripes-components');
    if (this.props.translations) {
      this.props.translations.forEach(tx => {
        Object.assign(t, prefixKeys(tx.translations, tx.prefix));
      });
    }

    return (
      <Provider store={store}>
        <IntlProvider locale="en" key="en" timeZone="UTC" messages={t}>
          {this.props.children}
        </IntlProvider>
      </Provider>
    );
  }
}

Harness.propTypes = {
  children: PropTypes.node,
  translations: PropTypes.arrayOf(
    PropTypes.shape({
      prefix: PropTypes.string,
      translations: PropTypes.object,
    })
  ),
};

export default Harness;
