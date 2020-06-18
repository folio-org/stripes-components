import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import css from './FocusLink.css';
import { getNextFocusable } from '../../util/getFocusableElements';
import separateComponentProps from '../../util/separateComponentProps';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
  component: PropTypes.string,
  showOnFocus: PropTypes.bool,
  tabIndex: PropTypes.number,
  target: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  targetNextAfter: PropTypes.element,
};

const FocusLink = (props) => {
  // eslint-disable-next-line react/forbid-foreign-prop-types
  const [{ target, component, tabIndex, targetNextAfter }, rest] = separateComponentProps(props, FocusLink.propTypes);

  let link = null;

  function focusTarget() {
    if (typeof target === 'string') {
      let id = target;

      if (target.charAt(0) === '#') {
        id = target.replace('#', '');
      }

      const tgt = document.getElementById(id);
      if (tgt) {
        tgt.focus();
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

  function getClass() {
    return classNames(
      css.focusLink,
      { [`${css.showOnFocus}`]: props.showOnFocus },
      props.className,
    );
  }

  if (component) {
    const Component = component;
    return (
      <Component
        ref={(ref) => { link = ref; }}
        role="button"
        tabIndex={tabIndex || 0}
        onClick={handleClick}
        onKeyPress={handleKeyPress}
        className={getClass()}
        {...rest}
      >
        { props.children }
      </Component>
    );
  }
  return (
    <div
      ref={(ref) => { link = ref; }}
      role="button"
      tabIndex={tabIndex || 0}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      className={getClass()}
      {...rest}
    >
      { props.children }
    </div>
  );
};

FocusLink.propTypes = propTypes;

export default FocusLink;
