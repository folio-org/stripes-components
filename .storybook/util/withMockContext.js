/**
 * Mock context decorator for storybook
 *
 * Adds a mock context to storybook which mimics the context provided in stripes-core
 * This prevents components that rely on contexts from failing to render
 */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';

// Define the contect types
const childContextTypes = {
  intl: intlShape,
};

// Define the mock context
const mockContext = {
  intl: {
    formatMessage: str => str,
    formatDate: val => val,
    formatTime: val => val,
    formatRelative: val => val,
    formatNumber: val => val,
    formatPlural: val => val,
    formatHTMLMessage: val => val,
    now: val => val,
  },
};

const mockContextHoC = (InjectComponent) => {
  return class WithMockContext extends Component {
    static childContextTypes = childContextTypes;
    getChildContext() {
      return mockContext;
    }

    render() {
      return (<InjectComponent {...this.props} />);
    }
  }
};

/**
 * Apply the HoC and return a decorator function
 */
const ContentWithMockContext = mockContextHoC(({children}) => <Fragment>{children}</Fragment>);
export default story => (<ContentWithMockContext>{story()}</ContentWithMockContext>);
