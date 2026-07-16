import PropTypes from 'prop-types';
import React from 'react';
import { addFocusListener, addBlurListener } from './focusListeners';

class FocusTrap extends React.Component {
  constructor(props) {
    super(props);

    this.focusListener = undefined;
    this.blurListener = undefined;
    this.willWrap = !this.props.noWrapper;
    this.setupNativeListeners = this.setupNativeListeners.bind(this);
    this.removeNativeListeners = this.removeNativeListeners.bind(this);
  };

  static propTypes = {
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    component: PropTypes.any,
    elementRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    noWrapper: PropTypes.bool,
    children: PropTypes.node,
  };

  static defaultProps = {
    component: 'div',
  };

  componentDidMount() {
    if (!this.willWrap && this.props.element) {
      this.setupNativeListeners();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.element && this.props.element) {
      this.setupNativeListeners();
    }
  }

  componentWillUnmount() {
    this.removeNativeListeners();
  }

  setupNativeListeners() {
    if (!this.focusListener) {
      const {
        onFocus,
        onBlur,
        element,
      } = this.props;

      const elem = element;

      if (elem && !this.focusListener) {
        if (!elem.getAttribute('tabindex')) {
          elem.setAttribute('tabindex', '-1');
        }
        this.focusListener = addFocusListener(elem, onFocus);
        this.blurListener = addBlurListener(elem, onBlur);
      } else {
        this.willWrap = true;
      }
    }
  }

  removeNativeListeners() {
    if (this.focusListener) {
      this.focusListener.remove();
      this.focusListener = null;
    }
    if (this.blurListener) {
      this.blurListener.remove();
      this.blurListener = null;
    }
  }

  render() {
    const {
      component: Component,
      children,
      elementRef,
      noWrapper,
      element,
      ...props
    } = this.props;

    if (this.willWrap) {
      return (
        <Component ref={elementRef} tabIndex="-1" {...props}>
          {children}
        </Component>
      );
    }

    return children;
  }
}

export default FocusTrap;
