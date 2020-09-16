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
    triggered: true,
    forceProductionError: true || process.env.NODE_ENV !== 'development',
  }

  render() {
    const { triggered, forceProductionError } = this.state;
    return (
      <>
        {triggered && (
          <ButtonGroup>
            <Button
              onClick={() => this.setState(state => ({ forceProductionError: !state.forceProductionError }))}
              buttonStyle={forceProductionError ? 'primary' : 'default'}
            >
              Production
            </Button>
            <Button
              onClick={() => this.setState(state => ({ forceProductionError: !state.forceProductionError }))}
              buttonStyle={forceProductionError ? 'default' : 'primary'}
            >
              Development
            </Button>
          </ButtonGroup>
        )}
        <ErrorBoundary forceProductionError={forceProductionError}>
          <Button onClick={() => this.setState({ triggered: true })}>Clicking me will trigger an error</Button>
          { triggered && <ComponentWithError /> }
        </ErrorBoundary>
      </>
    );
  }
}
