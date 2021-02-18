/**
 * ErrorBoundary
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage, ProductionError } from './components';
import css from './ErrorBoundary.css';

export default class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node,
    forceProductionError: PropTypes.bool,
    onError: PropTypes.func,
    onReset: PropTypes.func,
    resetButtonLabel: PropTypes.node,
    subTitle: PropTypes.node,
    title: PropTypes.node,
  };

  constructor(props) {
    super(props);

    this.state = {
      error: undefined,
      stack: undefined,
    };
  }

  componentDidCatch(error, info) {
    if (this.props.onError) {
      this.props.onError(error, info);
    }

    const { stack: errorStack } = error;
    const { componentStack } = info;

    const lines = `
      ${errorStack.toString()}
      ${componentStack.toString()}
    `.split('\n')
      // Remove empty lines
      .filter(str => !!str);

    const stack = lines
      // Remove the first line because it's the same as the error we get above
      .splice(1, lines.length)
      // Remove whitespace
      .map(str => str.replace(/\s+/, ''))
      .join('\n');

    this.setState({ error: error.toString(), stack });
  }

  renderError = () => {
    const { forceProductionError, title, subTitle, resetButtonLabel, onReset } = this.props;
    const { error, stack } = this.state;
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment && !forceProductionError) {
      return (
        <ErrorMessage
          error={error}
          stack={stack}
        />
      );
    }

    return (
      <ProductionError
        error={error}
        onReset={onReset}
        resetButtonLabel={resetButtonLabel}
        stackTrace={stack}
        subTitle={subTitle}
        title={title}
      />
    );
  }

  render() {
    const { error } = this.state;

    if (error) {
      return (
        <div className={css.root} data-test-error-boundary>
          {this.renderError()}
        </div>
      );
    }

    return this.props.children;
  }
}
