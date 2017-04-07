import React from 'react';
import _ from 'lodash';
import css from './Pane.css';
import PaneHeader from '../PaneHeader';
import Paneset from '../Paneset';


const propTypes = {
  defaultWidth: React.PropTypes.string,
  onClose: React.PropTypes.func,
  transition: React.PropTypes.string,
  children: React.PropTypes.node,
  dismissible: React.PropTypes.oneOfType( // eslint-disable-line
    [
      React.PropTypes.bool,
      React.PropTypes.string,
    ],
  ),
};

const contextTypes = {
  paneset: React.PropTypes.instanceOf(Paneset),

};

const defaultProps = {
  transition: 'none',
};

class Pane extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      style: {},
      contentMinWidth: 0,
    };

    this.id = _.uniqueId();
    this.contentMinWidth = 0;
    this.getContentWidth = this.getContentWidth.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillMount() {
    if (this.props.defaultWidth !== 'fill') {
      this.setState({
        style: { flex: `0 0 ${this.props.defaultWidth}` },
      });
    }
  }

  componentDidMount() {
    let transition;
    if (this.props.transition !== 'none') {
      transition = true;
    }
    const paneObject = { transition, ref: this, id: this.id };
    this.context.paneset.registerPane(paneObject);
    window.requestAnimationFrame(() => {
      this.setState({ contentMinWidth: this.getContentWidth() });
    });
  }

  componentWillUnmount() {
    this.context.paneset.removePane(this.id);
  }

  setStyle(style) {
    this.setState((oldState) => {
      const nextState = oldState;
      // clone because you can't mutate style....
      const newStyle = Object.assign({}, nextState.style, style);
      nextState.style = newStyle;
      return nextState;
    });
  }

  getContentWidth() {
    if (this.props.defaultWidth === 'fill') {
      return '960px';
    }
    const widthNum = parseInt(this.props.defaultWidth, 10);
    const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const widthCalc = ((widthNum / 100) * w) - 175;
    return `${widthCalc}px`;
  }

  handleClose() {
    if (this.props.transition !== 'none') {
      this.context.paneset.handleClose(this.id, this.props.onClose);
    } else {
      this.props.onClose();
    }
  }

  render() {
    return (
      <div className={css.pane} style={this.state.style} ref={(ref) => { this.el = ref; }}>
        <PaneHeader {...this.props} onClose={this.handleClose} key={`${this.id}-header`} />,
        <div key={`${this.id}-content`} style={{ width: '100%', minWidth: this.state.contentMinWidth, height: '100%', overflow: 'auto', padding: '16px' }}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Pane.propTypes = propTypes;
Pane.defaultProps = defaultProps;
Pane.contextTypes = contextTypes;

export default Pane;
