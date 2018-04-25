import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.object,
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

  render() {
    const { error, info } = this.state;
    if (error) {
      return (
        <div>
          <h2>Please refresh the page.</h2>
          <h2>The following occurred resulting in the current page becoming unstable.</h2>
          <h3>ERROR: {error.message}</h3>
          <pre>{info.componentStack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
