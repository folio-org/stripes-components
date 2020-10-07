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
      element: 'div'
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.message !== undefined &&
      this.props.message !== '') {
      if (this.props.message === prevProps.message) {
        if (this.willUpdateRepeats) {
          this.sendMessage(this.props.message);
        }
      } else {
        this.sendMessage(this.props.message);
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
    this.updateTimer = setTimeout(() => { this.allowRepeatMessage(); }, 500);
  }

  allowRepeatMessage() {
    this.willUpdateRepeats = true;
    this.setState(({ element }) => ({
      updates: [],
      // Changing the HTML element of the aria-live region after each announcement
      // enables the Mac screen reader to repeat the same message twice if needed.
      // Without this, the message will only be read once which can be problematic when used in e.g. a form validation.
      element: element === 'div' ? 'span' : 'div'
    }), () => {
      this.forceUpdate();
    });
  }

  render() {
    const { ariaLive, ...rest } = this.props;
    const { element: Element } = this.state;

    return (
      <Element aria-live={rest['aria-live'] || ariaLive} aria-relevant="additions" className="sr-only">
        {this.state.updates}
      </Element>
    );
  }
}

export default SRStatus;
