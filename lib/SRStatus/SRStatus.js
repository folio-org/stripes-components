import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

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

  shouldComponentUpdate(nextProps)
  {
    if (nextProps.message !== undefined &&
      nextProps.message !== '') {
      return true;
    }
    if (nextProps.ariaLive !== this.props.ariaLive || !isEqual(nextProps.rest, this.props.rest)) {
      return true;
    }
    return false;
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.message === this.props.message) {
      if (this.willUpdateRepeats) {
        this.sendMessage(this.props.message);
      }
    } else {
      this.sendMessage(this.props.message);
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
    this.updateTimer = setTimeout(() => { this.allowRepeatMessage(); }, 500);
  }

  allowRepeatMessage() {
    this.willUpdateRepeats = true;
    // this.setState({ updates: [] }, () => { this.forceUpdate(); });
  }

  render() {
    const { ariaLive, ...rest } = this.props;

    return (
      <div aria-live={rest['aria-live'] || ariaLive} aria-relevant="additions" className="sr-only">
        {this.state.updates}
      </div>
    );
  }
}

export default SRStatus;
