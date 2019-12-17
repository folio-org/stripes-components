import React from 'react';
import PropTypes from 'prop-types';

class SRStatus extends React.Component {
  static propTypes = {
    ariaLive: PropTypes.oneOf(['polite', 'assertive', 'off']),
    message: PropTypes.string,
  }

  static defaultProps = {
    ariaLive: 'assertive',
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
    this.updateTimer = setTimeout(() => { this.allowRepeatMessage(); }, 250);
  }

  allowRepeatMessage() {
    this.willUpdateRepeats = true;
    this.setState({ updates: [] }, () => { this.forceUpdate(); });
  }

  render() {
    const { ariaLive } = this.props;

    return (
      <div aria-live={ariaLive} aria-relevant="additions" className="sr-only">
        {this.state.updates}
      </div>
    );
  }
}

export default SRStatus;
