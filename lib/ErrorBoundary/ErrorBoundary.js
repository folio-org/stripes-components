/**
 * ErrorBoundary
 */

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage, ProductionError } from './components';
import css from './ErrorBoundary.css';

class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node,
    forceProductionError: PropTypes.bool,
    onReset: PropTypes.func,
    resetButtonLabel: PropTypes.node,
    subTitle: PropTypes.node,
    title: PropTypes.node,
  };

  constructor(props) {
    super(props);

    this.state = {
      error: undefined,
      info: undefined,
    };

    this.copyRef = createRef(null);
  }

  componentDidCatch(error, info) {
    this.setState({ error: error.toString(), info });
  }

  renderError = () => {
    const { forceProductionError, title, subTitle, resetButtonLabel, onReset } = this.props;
    const { error, info: { componentStack } } = this.state;
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment && !forceProductionError) {
      return (
        <ErrorMessage
          error={error}
          stack={componentStack}
        />
      );
    }

    return (
      <ProductionError
        error={error}
        onReset={onReset}
        resetButtonLabel={resetButtonLabel}
        stackTrace={componentStack}
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

export default ErrorBoundary;
