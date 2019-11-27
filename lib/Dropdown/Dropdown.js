
import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';
import isEqual from 'lodash/isEqual';
import isBoolean from 'lodash/isBoolean';
import classNames from 'classnames';
import contains from 'dom-helpers/query/contains';
import css from './Dropdown.css';
import Popdown from './Popdown';
import omit from '../../util/omitProps';
import { isStatefulComponent } from '../../util/isStatefulComponent';
import {
  getNextFocusable,
  getPreviousFocusable,
  getLastFocusable,
  getFirstFocusable
} from '../../util/getFocusableElements';

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
  onSelectItem: PropTypes.func,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
  placement: PropTypes.string,
  pullRight: PropTypes.bool,
  relativePosition: PropTypes.bool,
  renderTrigger: PropTypes.func,
  tag: PropTypes.string,
  tether: PropTypes.object,
  usePortal: PropTypes.bool,
};

const defaultProps = {
  hasPadding: true,
  tag: 'div',
  tether: {
    attachment: 'top center',
    renderElementTo: null,
    targetAttachment: 'bottom center',
    optimizations: {
      gpu: false,
    },
    constraints: [{
      to: 'window',
      attachment: 'together',
    },
    {
      to: 'scrollParent',
      pin: true,
    },
    ],
  },
  usePortal: true,
};

function menuHandleKeyDown({
  event: e,
  disabled,
  menuRef,
  onClose,
  focusLast,
  focusFirst,
}) {
  if (disabled) {
    return;
  }

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
      focusFirst(e);
      break;
    case 35: // end
      focusLast(e);
      break;
    case 27: // escape
      onClose(e);
      break;
    default:
  }
}

function triggerHandleKeyDown({ event: e, open, disabled, onToggle, menuRef, focusLast }) {
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
      setTimeout(() => focusLast());
    }
  }
}

const logWarning = (msg) => {
  console.warn(`Warning <Dropdown> - ${msg} 
  See documentation at: 
  https://github.com/folio-org/stripes-components/blob/popdown/lib/Dropdown/readme.md`);
};

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this._handleToggle = this._handleToggle.bind(this);
    this.triggerChild = null;
    this.menuChild = null;
    this._menu = React.createRef();
    this._toggle = React.createRef();
    this._renderTrigger = this._renderTrigger.bind(this);
    this._renderTetherChildren = this._renderTetherChildren.bind(this);
    this._isLegacy = (!isEqual(props.tether, Dropdown.defaultProps.tether));
    this._warned = false;
    if (this._isLegacy) {
      logWarning('`tether` functionality of Dropdown is deprecated');
    }
    if (props.onSelectItem || props.onSelect) {
      logWarning(`The \`onSelectItem\` and \`onSelect\` props are deprecated. Please
      assign handlers to individual children instead.`);
    }
  }

  componentDidUpdate(prevProps) {
    if (this._isLegacy && this.props.open && prevProps.open !== this.props.open) {
      if (this._menu.current && this._toggle.current === document.activeElement) {
        const menuContainer = this._menu.current.node || this._menu.current;
        const elem = getNextFocusable(menuContainer, true, true);
        if (elem) elem.focus();
      }
    }
  }

  _handleTriggerKeys = (e) => {
    triggerHandleKeyDown({
      event: e,
      open: this.props.open,
      disabled: this.props.disabled,
      onToggle: this._handleToggle,
      triggerRef: this._toggle,
      menuRef: this._menu,
      focusLast: this._focusLast,
    });
  }

  _handleMenuKeys = (e) => {
    menuHandleKeyDown({
      event: e,
      open: this.props.open,
      disabled: this.props.disabled,
      onToggle: this._handleToggle,
      menuRef: this._menu,
      triggerRef: this._toggle,
      onClose: this._handleClose,
      focusLast: this._focusLast,
      focusFirst: this._focusFirst,
    });
  }

  _focusLast = () => {
    if (this.menu.current) {
      const elem = getLastFocusable(this.menu.current);
      if (elem) elem.focus();
    }
  };

  _focusFirst = () => {
    if (this.menu.current) {
      const elem = getFirstFocusable(this.menu.current);
      if (elem) elem.focus();
    }
  };

  _handleClose = (e) => {
    if (this.props.open) {
      this._handleToggle(e);
    }
  }

  _handleToggle(e) {
    const { disabled, onToggle } = this.props;
    if (disabled) {
      return e && e.preventDefault();
    }

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (onToggle) {
      if (this.props.open && this._menu.current) {
        const menuParent = this._menu.current.node || this._menu.current;
        if (contains(menuParent, document.activeElement)) {
          if (this._toggle && this._toggle.current) {
            this._toggle.current.focus();
          }
        }
      }
      return onToggle(e);
    }

    return undefined;
  }

  _renderTetherChildren() {
    const {
      open,
      pullRight,
      disabled,
      id,
      hasPadding,
      children,
    } = this.props;

    const className = classNames(
      css.DropdownMenuTether,
      { [css.hasPadding]: hasPadding },
    );

    return React.Children.map(React.Children.toArray(children), (child) => {
      switch (child.props['data-role']) {
        case 'toggle': {
          this.triggerChild = cloneElement(child, {
            'ref': this._toggle,
            'onClick': this._handleToggle,
            'onKeyDown': this._handleTriggerKeys,
            'aria-expanded': open,
            'aria-haspopup': true,
            'key':'ddToggle',
            disabled,
          });
          return this.triggerChild;
        }
        case 'menu': {
          if (this.props.onSelectItem) {
            this.menuChild = cloneElement(child, {
              open,
              pullRight,
              key: 'ddMenu',
              labelledBy: id,
              className,
              onToggle: this._handleToggle,
              onSelectItem: this.props.onSelectItem,
              onKeyDown: this._handleMenuKeys,
              ref: isStatefulComponent(child) ? this._menu : undefined,
            });
          } else {
            this.menuChild = cloneElement(child, {
              open,
              pullRight,
              key: 'ddMenu',
              labelledBy: id,
              className,
              onToggle: this._handleToggle,
              ref: isStatefulComponent(child) ? this._menu : undefined,
              onKeyDown: this._handleMenuKeys,
            });
          }
          if (!this._warned) {
            logWarning(`the "data-role" API has been deprecated.
            Please use the \`renderTrigger\` and \`renderMenu\` props.`);
            this._warned = true;
          }
          return this.menuChild;
        }
        default: {
          return child;
        }
      }
    });
  }

  _renderTrigger = () => {
    if (!this.triggerChild) return undefined;
    return ({ getTriggerProps }) => {
      return cloneElement(
        this.triggerChild,
        { ...getTriggerProps() }
      );
    };
  }

  _renderMenu = () => {
    if (!this.menuChild) return undefined;
    return ({ onToggle }) => {
      return cloneElement(
        this.menuChild,
        { onClick: isBoolean(this.props.open) ? this.handleToggle : onToggle,
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
      tether,
      placement,
      buttonProps,
      hasPadding,
      dropdownClass,
      renderTrigger,
      renderMenu,
      usePortal,
      focusHandlers,
      relativePosition,
      modifiers,
      ...attributes
    } = omit(this.props, ['onToggle', 'onSelectItem', 'pullRight', 'dropdown', 'hasPadding']);

    const tetherChildren = this._renderTetherChildren();

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

    // if the tether prop was actually used
    if (this._isLegacy) {
      const mergedTetherProps = Object.assign({}, Dropdown.defaultProps.tether, tether, {
        classes: {
          ...tether.classes,
          element: dropdownClass,
        },
      });

      return (
        <Tag
          {...attributes}
          className={classes}
          ref={(ref) => { this._dropdown = ref; }}
        >
          <TetherComponent
            {...mergedTetherProps}
          >
            {tetherChildren}
          </TetherComponent>
        </Tag>
      );
    }

    return (
      <Tag
        {...attributes}
        className={classes}
      >
        <Popdown
          renderTrigger={renderTrigger || this._renderTrigger()}
          renderMenu={renderMenu || this._renderMenu()}
          focusHandlers={focusHandlers}
          overlayRef={this._menu}
          open={open}
          label={label}
          onToggle={this.props.onToggle}
          buttonProps={buttonProps}
          usePortal={usePortal}
          triggerKeyHandler={triggerHandleKeyDown}
          triggerRef={this._toggle}
          menuKeyHandler={menuHandleKeyDown}
          placement={placement}
          modifiers={modifiers}
        >
          {renderTrigger || !this._renderTrigger() ? children : this.menuChild}
        </Popdown>
      </Tag>
    );
  }
}

Dropdown.propTypes = propTypes;
Dropdown.defaultProps = defaultProps;

export default Dropdown;
