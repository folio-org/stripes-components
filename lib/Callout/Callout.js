import React from 'react';
import ReactDOM from 'react-dom';
import cloneDeep from 'lodash/cloneDeep';
import uniqueId from 'lodash/uniqueId';
import findIndex from 'lodash/findIndex';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import CalloutElement from './CalloutElement';
import css from './Callout.css';

class Callout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callouts: [],
    };
    this.timeouts = [];

    this.sendCallout = this.sendCallout.bind(this);
    this.removeCallout = this.removeCallout.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.updateCalloutContainer();
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.timeouts.forEach(t => {
      window.clearTimeout(t);
    });
  }

  updateCalloutContainer() {
    this.calloutContainer = document.getElementById('OverlayContainer');
  }

  sendCallout({ type = 'success', message, timeout = 6000 }) {
    const newCallout = Object.assign(
      { id: uniqueId('callout-'), onDismiss: this.removeCallout },
      { type, message, timeout }
    );

    if (this._isMounted) {
      this.setState((curState) => {
        const newState = cloneDeep(curState);
        newState.callouts.push(newCallout);
        if (timeout !== 0) {
          this.timeouts.push(window.setTimeout(() => { this.removeCallout(newCallout.id); }, timeout));
        }
        return newState;
      });
    }

    return newCallout.id;
  }

  removeCallout(id) {
    const toHide = findIndex(this.state.callouts, c => c.id === id);
    if (toHide === -1) { return; }
    if (this._isMounted) {
      this.setState((curState) => {
        const newState = cloneDeep(curState);
        newState.callouts.splice(toHide, 1);
        return newState;
      });
    }
  }

  render() {
    // We don't want to try and create a Portal if the callout container hasn't been rendered yet,
    // which is the case whenever the Callout Container is going to be put into the DOM at the same
    // or later time as this Callout.
    if (!this.calloutContainer) {
      this.updateCalloutContainer();
      if (!this.calloutContainer) {
        return null;
      }
    }

    return ReactDOM.createPortal(
      <div className={css.callout} data-test-callout>
        <TransitionGroup className={css.calloutContainer} aria-live="polite" aria-relevant="additions">
          {this.state.callouts.map(calloutProps => (
            <CalloutElement key={calloutProps.id} transition="slide" {...calloutProps} data-test-callout-element />
          ))}
        </TransitionGroup>
      </div>,
      this.calloutContainer
    );
  }
}

export default Callout;
