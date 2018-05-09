import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import translations from '../translations/en';

import { reducer as formReducer} from 'redux-form';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

const reducers = {
  form: formReducer
};

const reducer = combineReducers(reducers);

const store = createStore(reducer);

class Harness extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <IntlProvider locale="en" key="en" messages={translations}>
          {this.props.children}
        </IntlProvider>
      </Provider>
    );
  }
}

Harness.propTypes = {
  children: PropTypes.node,
};

export default Harness;
