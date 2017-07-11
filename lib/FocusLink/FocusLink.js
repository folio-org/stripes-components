import React from 'react';
import PropTypes from 'prop-types';
import css from './FocusLink.css';
import classNames from 'classnames';
import getNextFocusable from '../../util/getNextFocusable';

const propTypes = {
  target: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  targetNextAfter: PropTypes.element,
  showOnFocus: PropTypes.bool,
  component: PropTypes.any,
};

const FocusLink = (props) => {

  const { target, component, tabIndex, targetNextAfter, showOnFocus, ...rest } = props;

  let link = null;

  function handleClick(e) {
    e.preventDefault();
    if (props.target) {
      focusTarget();
    } else {
      focusNext();
    }
  }

  function handleKeyPress(e) {
    e.preventDefault();
    if (e.key === 'Enter') {
      if (props.target) {
        focusTarget();
      } else {
        focusNext();
      }
    }
  }

  function focusTarget() {
    if (typeof target === 'string') {
      if (target.charAt(0) === '#') {
        const tgt = document.getElementById(target);
        if (tgt) {
          tgt.focus();
        }
      }
    } else if (typeof target === 'object') {
      props.target.focus();
    }
  }

  function focusNext() {
    let nextFocusable;
    if (props.targetNextAfter) {
      nextFocusable = getNextFocusable(targetNextAfter, false);
    } else {
      nextFocusable = getNextFocusable(link, false);
    }
    nextFocusable.focus();
  }

  function getClass() {
    return classNames(
      { [`${css.showOnFocus}`]: props.showOnFocus }
    );
  }

  if (component) {
    const Component = component;
    return (
      <Component ref={(ref) => { link = ref; }} tabIndex={tabIndex || 0} onClick={handleClick} onKeyPress={handleKeyPress} className={getClass()} {...rest}>
        { props.children }
      </Component>
    );
  }
  return (
    <a href='#' ref={(ref) => { link = ref; }} onClick={handleClick} className={getClass()} {...rest}>
      { props.children }
    </a>
  );
};

export default FocusLink;
