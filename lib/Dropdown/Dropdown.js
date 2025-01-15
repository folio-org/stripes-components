
import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import css from './Dropdown.css';
import Popdown from './Popdown';
import omit from '../util/omitProps';
import {
  getNextFocusable,
  getPreviousFocusable,
  getLastFocusable,
  getFirstFocusable
} from '../util/getFocusableElements';

const propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  dropdownClass: PropTypes.string,
  focusHandlers: PropTypes.shape({
    close: PropTypes.func,
    open: PropTypes.func,
  }),
  hasPadding: PropTypes.bool,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  label: PropTypes.node,
  modifiers: PropTypes.object,
  onSelect: PropTypes.func,
  onSelectItem: PropTypes.func,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
  placement: PropTypes.string,
  pullRight: PropTypes.bool,
  relativePosition: PropTypes.bool,
  renderTrigger: PropTypes.func,
  tag: PropTypes.string,
  usePortal: PropTypes.bool,
};

const defaultProps = {
  hasPadding: true,
  tag: 'div',
  usePortal: true,
};

function menuHandleKeyDown({
  event: e,
  menuRef,
  onClose,
}) {
  let elem;
  switch (e.keyCode) {
    case 40: // down
      if (menuRef.current) {
        elem = getNextFocusable(menuRef.current, true, true);
        if (elem) elem.focus();
      }
      e.preventDefault();
      break;
    case 38: // up
      if (menuRef.current) {
        elem = getPreviousFocusable(menuRef.current, true, true);
        if (elem) {
          elem.focus();
        }
      }
      e.preventDefault();
      break;
    case 36: // home
      if (menuRef.current) {
        elem = getFirstFocusable(menuRef.current);
        if (elem) elem.focus();
      }
      break;
    case 35: // end
      if (menuRef.current) {
        elem = getLastFocusable(menuRef.current);
        if (elem) elem.focus();
      }
      break;
    case 27: // escape
      onClose(e);
      break;
    default:
  }
}

function triggerHandleKeyDown({ event: e, open, disabled, onToggle, menuRef }) {
  if (disabled) {
    return;
  }

  if (e.keyCode === 40) { // down
    if (!open) {
      onToggle(e);
    } else if (menuRef.current) {
      const elem = getNextFocusable(menuRef.current, true, true);
      if (elem) elem.focus();
    }
    e.preventDefault();
  }

  if (e.keyCode === 38) { // up
    if (!open) {
      onToggle(e);
      setTimeout(() => {
        if (menuRef.current) {
          const elem = getLastFocusable(menuRef.current);
          if (elem) elem.focus();
        }
      });
    }
  }
}

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.triggerChild = null;
    this.menuChild = null;
    this.menu = React.createRef();
    this.toggle = React.createRef();
    this.renderTrigger = this.renderTrigger.bind(this);
  }

  handleTriggerKeys = (e) => {
    triggerHandleKeyDown({
      event: e,
      open: this.props.open,
      disabled: this.props.disabled,
      onToggle: this.handleToggle,
      triggerRef: this.toggle,
      menuRef: this.menu,
    });
  }

  handleMenuKeys = (e) => {
    menuHandleKeyDown({
      event: e,
      open: this.props.open,
      disabled: this.props.disabled,
      onToggle: this.handleToggle,
      menuRef: this.menu,
      triggerRef: this.toggle,
      onClose: this.handleClose,
    });
  }

  handleClose = (e) => {
    if (this.props.open) {
      this.handleToggle(e);
    }
  }

  handleToggle(e) {
    const { disabled, onToggle } = this.props;
    if (disabled) {
      return e && e.preventDefault();
    }

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (onToggle) {
      if (this.props.open && this.menu.current) {
        const menuParent = this.menu.current.node || this.menu.current;
        if (menuParent.contains(document.activeElement)) {
          if (this.toggle && this.toggle.current) {
            this.toggle.current.focus();
          }
        }
      }
      return onToggle(e);
    }

    return undefined;
  }

  renderTrigger = () => {
    if (!this.triggerChild) return undefined;
    return ({ getTriggerProps }) => {
      return cloneElement(
        this.triggerChild,
        { ...getTriggerProps() }
      );
    };
  }

  renderMenu = () => {
    if (!this.menuChild) return undefined;
    return () => {
      return cloneElement(
        this.menuChild,
        { onClick: null,
          onKeyDown: null }
      );
    };
  }

  render() {
    const {
      className,
      children,
      tag: Tag,
      open,
      label,
      group,
      placement,
      buttonProps,
      hasPadding,
      renderTrigger,
      renderMenu,
      usePortal,
      focusHandlers,
      relativePosition,
      modifiers,
      disabled,
      ...attributes
    } = omit(this.props, ['onToggle', 'onSelectItem', 'pullRight', 'dropdown', 'hasPadding']);

    const classes = classNames(
      className,
      {
        [css.hasPadding]: hasPadding,
        [css.btnGroup]: group,
        [css.show]: open,
        [css.dropdown]: !group,
        [css.relative]: relativePosition,
      },
    );

    return (
      <Tag
        {...attributes}
        className={classes}
      >
        <Popdown
          renderTrigger={renderTrigger || this.renderTrigger()}
          renderMenu={renderMenu || this.renderMenu()}
          disabled={disabled}
          focusHandlers={focusHandlers}
          overlayRef={this.menu}
          open={open}
          label={label}
          onToggle={this.props.onToggle}
          buttonProps={buttonProps}
          usePortal={usePortal}
          triggerKeyHandler={triggerHandleKeyDown}
          triggerRef={this.toggle}
          menuKeyHandler={menuHandleKeyDown}
          placement={placement}
          modifiers={modifiers}
        >
          {renderTrigger || !this.renderTrigger() ? children : this.menuChild}
        </Popdown>
      </Tag>
    );
  }
}

Dropdown.propTypes = propTypes;
Dropdown.defaultProps = defaultProps;

export default Dropdown;
