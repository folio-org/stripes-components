import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import css from './Popover.css';

const propTypes = {
  position: PropTypes.oneOf(['top', 'start', 'end', 'bottom']),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  alignment: PropTypes.oneOf(['middle', 'center', 'start', 'end']),
  offset: PropTypes.number,
};

const defaultProps = {
  position: 'bottom',
  alignment: 'center',
  offset: 10,
};

class Popover extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      flippedPosition: false,
    };

    // position opposites for flipping if necessary...
    this._oppositeDirections = {
      start: 'end',
      end: 'start',
      top: 'bottom',
      bottom: 'top',
    };

    this.renderChildren = this.renderChildren.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.popRAF = null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.open && this.state.open) {
      this.updatePosition();
      window.addEventListener('scroll', this.handleScroll, true);
    }
    if (prevState.open && !this.state.open) {
      window.removeEventListener('scroll', this.handleScroll, true);
    }

    if (prevState.flippedPosition !== this.state.flippedPosition) {
      this.updatePosition();
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.popRAF);
    this.popRAF = null;
  }

  handleToggle() {
    this.setState((curState) => {
      const nextState = Object.assign({}, curState);
      nextState.open = !curState.open;
      return nextState;
    });
  }

  handleScroll() {
    this.updatePosition();
  }

  getPosition(targetRect, popRect, position) {
    const { offset } = this.props;
    const styleObject = {};
    switch (position) {
      case 'bottom': {
        styleObject.top = targetRect.bottom + offset;
        break;
      }
      case 'top': {
        styleObject.top = targetRect.top - popRect.height - offset;
        break;
      }
      case 'end': {
        const newLeft = targetRect.left + targetRect.width + offset;
        // this._popover.style.top = `${targetRect.top}px`;
        styleObject.left = newLeft;
        break;
      }
      case 'start': {
        const newLeft = targetRect.left - popRect.width - offset;
        // this._popover.style.top = `${targetRect.top}px`;
        styleObject.left = newLeft;
        break;
      }
      default:
        break;
    }
    return styleObject;
  }

  getAlignment(targetRect, popRect, position, alignment) { // eslint-disable-line class-methods-use-this
    let coordinate = 'left';
    let dimension = 'width';
    let a;
    const alignObject = {};

    if (position === 'start' || position === 'end') {
      coordinate = 'top';
      dimension = 'height';
    }

    switch (alignment) {
      case 'middle':
      case 'center': {
        // find centers of target and popover...
        const halfTarget = targetRect[dimension] / 2;
        const halfPop = popRect[dimension] / 2;
        // calculate final alignment
        a = (targetRect[coordinate] + halfTarget) - halfPop;
        // use the determined coordinate to set...
        alignObject[coordinate] = a;
        break;
      }
      case 'start': {
        a = targetRect[coordinate];
        alignObject[coordinate] = a;
        break;
      }
      case 'end': {
        a = targetRect[coordinate] - (popRect[dimension] - targetRect[dimension]);
        alignObject[coordinate] = a;
        break;
      }
      default:
        break;
    }

    return alignObject;
  }

  // check bounds against window...
  checkBounds(left, top, popRect, position) { // eslint-disable-line class-methods-use-this
    const correction = { flip: false };
    if (left < 0) {
      if (position === 'start') {
        correction.flip = true;
        return correction;
      }
      correction.left = 0;
    }

    if (left + popRect.width > window.innerWidth) {
      if (position === 'end') {
        correction.flip = true;
        return correction;
      }
      correction.left = window.innerWidth - popRect.width;
    }

    if (top < 0) {
      if (position === 'top') {
        correction.flip = true;
        return correction;
      }
      correction.top = 0;
    }

    if (top + popRect.height > window.innerHeight) {
      if (position === 'bottom') {
        correction.flip = true;
        return correction;
      }
      correction.top = window.innerHeight - popRect.height;
    }

    return correction;
  }

  updatePosition() {
    this.popRAF = requestAnimationFrame(() => {
      const targetRect = this._target.firstChild.getBoundingClientRect();
      const popRect = this._popover.getBoundingClientRect();

      let derivedPosition;

      if (this.state.flippedPosition) {
        derivedPosition = this._oppositeDirections[this.props.position];
      } else {
        derivedPosition = this.props.position;
      }

      const newPos = this.getPosition(targetRect, popRect, derivedPosition);

      const newAlign = this.getAlignment(targetRect, popRect, derivedPosition, this.props.alignment);
      const newStyle = Object.assign({}, newPos, newAlign);
      const chk = this.checkBounds(newStyle.left, newStyle.top, popRect, derivedPosition, this.props.alignment);

      // if it's out of bounds, set state and re-render...
      if (chk.flip) {
        // if it's already flipped, we don't want to re-render.
        if (!this.state.flippedPosition) {
          this.setState({ flippedPosition: true });
        }
      }

      const finalStyle = Object.assign({}, newStyle, chk);

      // push positioning into popover
      for (const p in finalStyle) {
        if (Object.prototype.hasOwnProperty.call(finalStyle, p)) {
          this._popover.style[p] = `${finalStyle[p]}px`;
        }
      }
    });
  }

  renderChildren() {
    if (!this._target) {
      React.Children.forEach(this.props.children, (child) => {
        switch (child.props['data-role']) {
          case 'target': {
            const target = React.cloneElement(
              child,
              Object.assign(
                {
                  onClick: () => { this.handleToggle(); },
                },
                child.props,
              ),
            );
            this.rendered_target = (
              <div className={css.popoverTarget} ref={(t) => { this._target = t; }}>
                {target}
              </div>
            );
            break;
          }
          case 'popover': {
            const popover = React.cloneElement(
              child,
              child.props,
            );
            this.rendered_popover = (
              <div>
                <RootCloseWrapper onRootClose={this.handleToggle}>
                  <div className={css.popoverPop} ref={(t) => { this._popover = t; }}>
                    {popover}
                  </div>
                </RootCloseWrapper>
              </div>
            );
            break;
          }
          default:
            break;
        }
      });
    }
  }

  render() {
    this.renderChildren();

    let popover = null;
    if (this.state.open) {
      popover = ReactDOM.createPortal(
        this.rendered_popover,
        document.body,
      );
    }
    return (
      <div>
        {this.rendered_target}
        {popover}
      </div>
    );
  }
}

Popover.propTypes = propTypes;
Popover.defaultProps = defaultProps;

export default Popover;
