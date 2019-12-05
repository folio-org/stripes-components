
import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';
import isEqual from 'lodash/isEqual';
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
  onSelect: PropTypes.func,
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

const logWarning = (msg) => {
  console.warn(`Warning <Dropdown> - ${msg} 
  See documentation at: 
  https://github.com/folio-org/stripes-components/blob/popdown/lib/Dropdown/readme.md`);
};

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.triggerChild = null;
    this.menuChild = null;
    this.menu = React.createRef();
    this.toggle = React.createRef();
    this.renderTrigger = this.renderTrigger.bind(this);
    this.renderTetherChildren = this.renderTetherChildren.bind(this);
    this.isLegacy = (!isEqual(props.tether, Dropdown.defaultProps.tether));
    this.warned = false;
    if (this.isLegacy) {
      logWarning('`tether` functionality of Dropdown is deprecated');
    }
    if (props.onSelectItem || props.onSelect) {
      logWarning(`The \`onSelectItem\` and \`onSelect\` props are deprecated. Please
      assign handlers to individual children instead.`);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.isLegacy && this.props.open && prevProps.open !== this.props.open) {
      if (this.menu.current && this.toggle.current === document.activeElement) {
        const menuContainer = this.menu.current.node || this.menu.current;
        const elem = getNextFocusable(menuContainer, true, true);
        if (elem) elem.focus();
      }
    }
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
        if (contains(menuParent, document.activeElement)) {
          if (this.toggle && this.toggle.current) {
            this.toggle.current.focus();
          }
        }
      }
      return onToggle(e);
    }

    return undefined;
  }

  renderTetherChildren() {
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
            'ref': this.toggle,
            'onClick': this.handleToggle,
            'onKeyDown': this.handleTriggerKeys,
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
              onToggle: this.handleToggle,
              onSelectItem: this.props.onSelectItem,
              onKeyDown: this.handleMenuKeys,
              ref: isStatefulComponent(child) ? this.menu : undefined,
            });
          } else {
            this.menuChild = cloneElement(child, {
              open,
              pullRight,
              key: 'ddMenu',
              labelledBy: id,
              className,
              onToggle: this.handleToggle,
              ref: isStatefulComponent(child) ? this.menu : undefined,
              onKeyDown: this.handleMenuKeys,
            });
          }
          if (!this.warned) {
            logWarning(`the "data-role" API has been deprecated.
            Please use the \`renderTrigger\` and \`renderMenu\` props.`);
            this.warned = true;
          }
          return this.menuChild;
        }
        default: {
          return child;
        }
      }
    });
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
      disabled,
      ...attributes
    } = omit(this.props, ['onToggle', 'onSelectItem', 'pullRight', 'dropdown', 'hasPadding']);

    const tetherChildren = this.renderTetherChildren();

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
    if (this.isLegacy) {
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
          ref={(ref) => { this.dropdown = ref; }}
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
