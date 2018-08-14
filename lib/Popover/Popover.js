import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import Transition from 'react-transition-group/Transition';
import css from './Popover.css';

const propTypes = {
  activeClass: PropTypes.string,
  alignment: PropTypes.oneOf(['middle', 'center', 'start', 'end']),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  noPadding: PropTypes.bool,
  offset: PropTypes.number,
  position: PropTypes.oneOf(['top', 'start', 'end', 'bottom']),
};

const defaultProps = {
  alignment: 'center',
  noPadding: false,
  offset: 5,
  position: 'bottom',
};

class Popover extends React.Component {
  constructor(props) {
    super(props);

    this.timout = null;
    this.delay = 1000;

    this.state = {
      open: false,
      visible: false,
      flippedPosition: false,
    };

    // position opposites for flipping if necessary...
    this._oppositeDirections = {
      start: 'end',
      end: 'start',
      top: 'bottom',
      bottom: 'top',
    };

    this.updateContainer = this.updateContainer.bind(this);
    this.renderChildren = this.renderChildren.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.popRAF = null;
  }

  componentDidUpdate(prevProps, prevState) {
    // Popover opens
    if (!prevState.open && this.state.open) {
      this.updatePosition();
      window.addEventListener('scroll', this.handleScroll, true);

      // Focus Popover body
      if (this._popover) {
        this._popover.focus();
      }
    }

    // Popover closes
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

  updateContainer() {
    this.popContainer = document.getElementById('OverlayContainer');
  }

  handleToggle(e) {
    e.stopPropagation();
    this.setState((curState) => {
      const { open } = curState;
      const nextState = Object.assign({}, curState);
      if (!open) {
        nextState.open = true;
        nextState.visible = true;
      } else {
        nextState.visible = false;
      }
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

  getAlignment(targetRect, popRect, position, alignment) {
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
  checkBounds(left, top, popRect, position) {
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
      const chk = this.checkBounds(newStyle.left, newStyle.top, popRect, derivedPosition);

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
                  onClick: (e) => { this.handleToggle(e); },
                },
                child.props,
              ),
            );
            this.rendered_target = (
              <div className={css.popoverTarget} ref={(t) => { this._target = t; }} key="target">
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
              <RootCloseWrapper onRootClose={this.handleToggle}>
                <div
                  tabIndex="-1"
                  role="dialog"
                  className={classnames(css.popoverPop, { [css.noPadding]: this.props.noPadding })}
                  ref={(t) => { this._popover = t; }}
                >
                  {popover}
                </div>
              </RootCloseWrapper>
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

    if (!this.popContainer) {
      this.updateContainer();
      if (!this.popContainer) {
        return null;
      }
    }

    if (this.state.open) {
      popover = ReactDOM.createPortal(
        <Transition
          key="popover"
          appear
          timeout={70}
          in={this.state.visible}
          onExited={() => this.setState({ open: false })}
        >
          { status => (
            <div className={classnames(css.transition, css[`transition-${status}`])}>
              {this.rendered_popover}
            </div>
          )}
        </Transition>,
        this.popContainer,
      );
    }
    return (
      <span className={classnames({ [this.props.activeClass]: this.props.activeClass && this.state.open })}>
        {this.rendered_target}
        {popover}
      </span>
    );
  }
}

Popover.propTypes = propTypes;
Popover.defaultProps = defaultProps;

export default Popover;
