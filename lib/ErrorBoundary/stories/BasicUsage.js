/**
 * ErrorBoundary: Basic Usage
 */

import React, { Component } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import Button from '../../Button';

const ComponentWithError = () => <div>{kapooow}</div>; /* eslint-disable-line no-undef */

export default class BasicUsage extends Component {
  state = {
    triggered: false,
  }

  render() {
    const { triggered } = this.state;
    return (
      <ErrorBoundary>
        <Button onClick={() => this.setState({ triggered: true })}>Clicking me will trigger an error</Button>
        {/* { triggered && <ComponentWithError /> } */}
        <ComponentWithError />
      </ErrorBoundary>
    );
  }
}
