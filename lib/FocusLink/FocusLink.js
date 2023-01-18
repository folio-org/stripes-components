import React, { useCallback, useRef } from 'react';
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

function focusTarget(target) {
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
    target.focus();
  }
}

function focusNext(targetNextAfter = false, link) {
  let nextFocusable;
  if (targetNextAfter) {
    nextFocusable = getNextFocusable(targetNextAfter, false);
  } else {
    nextFocusable = getNextFocusable(link.current, false);
  }
  nextFocusable.focus();
}

const FocusLink = (props) => {
  // eslint-disable-next-line react/forbid-foreign-prop-types
  const [{ target, component, tabIndex, targetNextAfter }, rest] = separateComponentProps(props, FocusLink.propTypes);

  let link = useRef(null);

  const handleClick = useCallback((e) => {
    e.preventDefault();
    if (props.target) {
      focusTarget(target);
    } else {
      focusNext(targetNextAfter, link);
    }
  }, [props.target, targetNextAfter, link, target])

  const handleKeyDown = useCallback((e) => {
    e.preventDefault();
    if (e.key === 'Enter') {
      if (props.target) {
        focusTarget(target);
      } else {
        focusNext(targetNextAfter, link);
      }
    }
  }, [props.target, targetNextAfter, link, target])

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
        data-test-focus-link
        ref={link}
        role="button"
        tabIndex={tabIndex || 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={getClass()}
        {...rest}
      >
        { props.children }
      </Component>
    );
  }
  return (
    <div
      data-test-focus-link
      ref={(ref) => { link = ref; }}
      role="button"
      tabIndex={tabIndex || 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={getClass()}
      {...rest}
    >
      { props.children }
    </div>
  );
};

FocusLink.propTypes = propTypes;

export default FocusLink;
