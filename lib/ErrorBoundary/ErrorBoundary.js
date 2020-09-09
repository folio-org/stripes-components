import React from 'react';
import PropTypes from 'prop-types';

import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import * as Sentry from "@sentry/react";
import Rollbar from 'rollbar';

import { errorLogging } from 'stripes-config';


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

    // list of available error handlers
    this.handlers = [];

    // bugsnag
    if (errorLogging.bugsnag) {
      const { apiKey } = errorLogging.bugsnag;
      Bugsnag.start({
        apiKey,
        plugins: [new BugsnagPluginReact()],
      });
      this.handlers.push((e) => Bugsnag.notify(e));
    }

    // rollbar
    if (errorLogging.rollbar) {
      const rollbar = new Rollbar({ ...errorLogging.rollbar });
      this.handlers.push((e) => rollbar.error(e));
    }

    // sentry
    if (errorLogging.sentry) {
      Sentry.init({ ...errorLogging.sentry });
      this.handlers.push((e) => Sentry.captureException(e));
    }
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });

    // notify all handlers
    this.handlers.forEach(h => h(error));
  }

  render() {
    const { error, info } = this.state;
    if (error) {
      return (
        <div>
          <h2>Please refresh the page.</h2>
          <h2>The following occurred resulting in the current page becoming unstable.</h2>
          <h3>
ERROR:
            {error.message}
          </h3>
          <pre>{info.componentStack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
