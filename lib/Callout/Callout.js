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
      callouts: {},
    };
    this.timeouts = [];
    this.pendingCallouts = {};

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

  getDuplicateKey(type, message) {
    return `${type}:${message}`;
  }

  sendCallout({ type = 'success', message, timeout = 6000, dedupe = true }) {
    // Check for duplicate messages if dedupe is true
    if (dedupe) {
      const duplicateKey = this.getDuplicateKey(type, message);

      if (this.pendingCallouts[duplicateKey]) {
        return this.pendingCallouts[duplicateKey];
      }
    }

    const newCallout = Object.assign(
      { id: uniqueId('callout-'), onDismiss: this.removeCallout },
      { type, message, timeout }
    );

    // When multiple sendCallout calls happen simultaneously,
    // they all read the same state before any updates occur,
    // so track this callout immediately to prevent duplicates.
    if (dedupe) {
      const duplicateKey = this.getDuplicateKey(type, message);
      this.pendingCallouts[duplicateKey] = newCallout.id;
    }

    if (this._isMounted) {
      this.setState((curState) => {
        const newState = cloneDeep(curState);
        newState.callouts[newCallout.id] = newCallout;
        if (timeout !== 0) {
          this.timeouts.push(window.setTimeout(() => { this.removeCallout(newCallout.id); }, timeout));
        }
        return newState;
      });
    }

    return newCallout.id;
  }

  removeCallout(id) {
    if (!this.state.callouts[id]) { return; }

    const callout = this.state.callouts[id];
    const duplicateKey = this.getDuplicateKey(callout.type, callout.message);
    delete this.pendingCallouts[duplicateKey];

    if (this._isMounted) {
      this.setState((curState) => {
        const newState = cloneDeep(curState);
        delete newState.callouts[id];
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
          {Object.values(this.state.callouts).map(calloutProps => (
            <CalloutElement key={calloutProps.id} transition="slide" {...calloutProps} data-test-callout-element />
          ))}
        </TransitionGroup>
      </div>,
      this.calloutContainer
    );
  }
}

export default Callout;
