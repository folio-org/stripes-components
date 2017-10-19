import React from 'react';
import { Portal } from 'react-overlays'; // eslint-disable-line
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

    this.sendCallout = this.sendCallout.bind(this);
    this.removeCallout = this.removeCallout.bind(this);
  }

  sendCallout({ type = 'success', message, timeout = 6000 }) {
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      const newCallout = Object.assign({ id: uniqueId('callout-'), onDismiss: this.removeCallout }, { type, message, timeout });
      newState.callouts.push(newCallout);
      if (timeout !== 0) {
        window.setTimeout(() => { this.removeCallout(newCallout.id); }, timeout);
      }
      return newState;
    });
  }

  removeCallout(id) {
    const toHide = findIndex(this.state.callouts, c => c.id === id);
    if (toHide === -1) { return; }
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      newState.callouts.splice(toHide, 1);
      return newState;
    });
  }

  render() {
    return (
      <Portal container={document.body}>
        <div className={css.calloutRoot}>
          <TransitionGroup className={css.calloutContainer} aria-live="polite" aria-relevant="additions">
            {this.state.callouts.map(calloutProps => (
              <CalloutElement key={calloutProps.id} transition="slide" {...calloutProps} />
            ))}
          </TransitionGroup>
        </div>
      </Portal>
    );
  }
}

export default Callout;
