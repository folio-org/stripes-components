/**
 * ErrorBoundary
 */

import React from 'react';
import PropTypes from 'prop-types';
import Headline from '../Headline';
import MessageBanner from '../MessageBanner';
import css from './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);

    this.state = {
      error: undefined,
      info: undefined,
    };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
  }

  renderProductionError = () => {
    return <div>Production error</div>;
  }

  renderDevelopmentError = () => {
    const { error, info } = this.state;

    return (
      <div className={css.root}>
        <MessageBanner
          type="error"
          icon={null}
          className={css.errorMessage}
          contentClassName={css.errorMessageContent}
        >
          <Headline size="x-large" className={css.errorTitle}>
            Error: {error.message}
          </Headline>
          <pre className={css.errorStack}>{info.componentStack}</pre>
        </MessageBanner>
      </div>
    );
  }

  render() {
    const { error, info } = this.state;
    if (error) {
      if (process.env.NODE_ENV === 'development') {
        return this.renderDevelopmentError();
      }

      return this.renderProductionError();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
