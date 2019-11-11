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

/**
 * mimics the StripesTranslationPlugin in @folio/stripes-core:
 * given a list of key-value pairs like {"foo": "bar"} and a prefix,
 * return {"prefix.foo": "bar", ...}.
 *
 * @param {*} obj map of key-value pairs
 * @param {*} prefix module-path to prepend to each key
 */
function prefixKeys(obj, prefix) {
  const res = {};
  for (const key of Object.keys(obj)) {
    res[`${prefix}.${key}`] = obj[key];
  }
  return res;
}

/**
 * mount a component with contexts provided by redux-store
 * and react-intl.
 */
class Harness extends React.Component {
  render() {
    const allTranslations = prefixKeys(translations, 'stripes-components');
    this.props.translations.forEach(tx => {
      Object.assign(allTranslations, prefixKeys(tx.translations, tx.prefix));
    });

    return (
      <Provider store={store}>
        <IntlProvider locale="en" key="en" timeZone="UTC" messages={allTranslations}>
          {this.props.children}
        </IntlProvider>
      </Provider>
    );
  }
}

Harness.propTypes = {
  // the components to render into the context
  children: PropTypes.node,
  // l10n map for the component's translation keys
  translations: PropTypes.arrayOf(
    PropTypes.shape({
      prefix: PropTypes.string,
      translations: PropTypes.object,
    })
  ),
};

Harness.defaultProps = {
  translations: [],
};

export default Harness;
