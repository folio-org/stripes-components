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
    layout: process.env.NODE_ENV,
  }

  render() {
    const { triggered, layout } = this.state;

    return (
      <>
        {triggered && (
          <ButtonGroup>
            <Button
              onClick={() => this.setState({ layout: 'production' })}
              buttonStyle={layout === 'production' ? 'primary' : 'default'}
            >
              Production
            </Button>
            <Button
              onClick={() => this.setState({ layout: 'development' })}
              buttonStyle={layout === 'development' ? 'primary' : 'default'}
            >
              Development
            </Button>
          </ButtonGroup>
        )}
        <ErrorBoundary layout={layout}>
          <Button onClick={() => this.setState({ triggered: true })}>Clicking me will trigger an error</Button>
          { triggered && <ComponentWithError /> }
        </ErrorBoundary>
      </>
    );
  }
}
