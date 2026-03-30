// @ts-nocheck
/**
 * ErrorBoundary
 */

import React, { Component } from "react";
import { mapStackTrace } from "sourcemapped-stacktrace";

import { ErrorMessage, ProductionError } from "./components";
import css from "./ErrorBoundary.css";
type ErrorBoundaryProps = {
  children?: React.ReactNode;
  forceProductionError?: boolean;
  onError?: (...args: any[]) => any;
  onReset?: (...args: any[]) => any;
  resetButtonLabel?: React.ReactNode;
  subTitle?: React.ReactNode;
  title?: React.ReactNode;
};

export default class ErrorBoundary extends Component<ErrorBoundaryProps> {
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

    this.setState({ error: error.toString(), stack: error.stack });
  }

  renderError = () => {
    const { forceProductionError, title, subTitle, resetButtonLabel, onReset } =
      this.props;
    const { error, stack } = this.state;
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment && !forceProductionError) {
      return <ErrorMessage error={error} stack={stack} />;
    }

    return (
      <ProductionError
        error={error}
        onReset={onReset}
        resetButtonLabel={resetButtonLabel}
        stackTrace={stack}
        subTitle={subTitle}
        title={title}
        mapStackTrace={mapStackTrace}
      />
    );
  };

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
