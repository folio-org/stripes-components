import React from 'react';
import PropTypes from 'prop-types';

class SRStatus extends React.Component {
  static propTypes = {
    message: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.willUpdateRepeats = true;
    this.updateTimer = null;
    this.allowRepeatMessage = this.allowRepeatMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.startUpdateTimer = this.startUpdateTimer.bind(this);
    this.state = {
      updates: [],
    };
  }

  componentWillReceiveProps(nextProps) { // eslint-disable-line react/no-deprecated
    if (nextProps.message !== undefined &&
      nextProps.message !== '') {
      if (nextProps.message === this.props.message) {
        if (this.willUpdateRepeats) {
          this.sendMessage(nextProps.message);
        }
      } else {
        this.sendMessage(nextProps.message);
      }
    }
  }

  componentWillUnmount() {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
  }

  sendMessage(msg) {
    this.setState((oldState) => {
      const newState = oldState;
      newState.updates.push((<div key={Math.random() * 12345}>{msg}</div>));
      this.startUpdateTimer();
      return newState;
    });
  }

  startUpdateTimer() {
    this.willUpdateRepeats = false;
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(() => { this.allowRepeatMessage(); }, 100);
  }

  allowRepeatMessage() {
    this.willUpdateRepeats = true;
    this.setState({ updates: [] }, () => { this.forceUpdate(); });
  }

  render() {
    const srStyle = {
      position: 'absolute !important',
      clip: 'rect(1px, 1px, 1px, 1px)',
      height: '1px',
      width: '1px',
      overflow: 'hidden',
    };

    return (
      <div aria-live="assertive" aria-relevant="additions" style={srStyle}>
        {this.state.updates}
      </div>
    );
  }
}

export default SRStatus;
