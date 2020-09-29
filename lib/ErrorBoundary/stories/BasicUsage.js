/**
 * ErrorBoundary: Basic Usage
 */

import React, { Component } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import Button from '../../Button';
import ButtonGroup from '../../ButtonGroup';

const ComponentWithError = () => <div>{kapooow}</div>; /* eslint-disable-line no-undef */

export default class BasicUsage extends Component {
  state = {
    triggered: false,
    forceProductionError: process.env.NODE_ENV === 'production',
  }

  render() {
    const { triggered, layout, forceProductionError } = this.state;

    return (
      <>
        {triggered && (
          <ButtonGroup>
            <Button
              onClick={() => this.setState({ forceProductionError: true })}
              buttonStyle={forceProductionError ? 'primary' : 'default'}
            >
              Production
            </Button>
            <Button
              onClick={() => this.setState({ forceProductionError: false })}
              buttonStyle={!forceProductionError ? 'primary' : 'default'}
            >
              Development
            </Button>
          </ButtonGroup>
        )}
        <ErrorBoundary layout={layout} forceProductionError={forceProductionError}>
          <Button onClick={() => this.setState({ triggered: true })}>Clicking me will trigger an error</Button>
          { triggered && <ComponentWithError /> }
        </ErrorBoundary>
      </>
    );
  }
}
