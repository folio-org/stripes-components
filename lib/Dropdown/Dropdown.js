
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
import { getNextFocusable, getPreviousFocusable } from '../../util/getFocusableElements';

const propTypes = {
  children: PropTypes.node,
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
  onSelect: PropTypes.func,
  onSelectItem: PropTypes.func,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
  placement: PropTypes.string,
  popper: PropTypes.object,
  pullRight: PropTypes.bool,
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
};

function menuHandleKeyDown(e, open, disabled, onToggle, menuRef, onClose) {
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
        elem = getPreviousFocusable(menuRef.current, true, true, false);
        if (elem === document.activeElement) {
          onToggle(e);
        } else {
          elem.focus();
        }
      }
      e.preventDefault();
      break;
    case 27: // escape
      onClose(e);
      break;
    default:
  }
}

function triggerHandleKeyDown(e, open, disabled, onToggle) {
  if (disabled) {
    return;
  }

  if (e.keyCode === 40) { // down
    if (!open) {
      onToggle(e);
    }
    e.preventDefault();
  }
}

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
  }

  componentDidUpdate(prevProps) {
    if (this.props.open && prevProps.open !== this.props.open) {
      if (this._menu.current && this._toggle.current === document.activeElement) {
        const menuContainer = this._menu.current.node || this._menu.current;
        const elem = getNextFocusable(menuContainer, true, true);
        if (elem) elem.focus();
      }
    }
  }

  _handleTriggerKeys = (e) => {
    triggerHandleKeyDown(
      e,
      this.props.open,
      this.props.disabled,
      this._handleToggle,
    );
  }

  _handleMenuKeys = (e) => {
    menuHandleKeyDown(
      e,
      this.props.open,
      this.props.disabled,
      this._handleToggle,
      this._menu,
      this._handleClose
    );
  }

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
            console.warn(`Warning: <Dropdown> - the \`onSelectItem\` prop is deprecated.
            Please assign listeners to menu children individually.
            See documentation at:
            https://github.com/folio-org/stripes-components/blob/popdown/lib/Dropdown/readme.md`);
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
          console.warn(`Warning: <Dropdown> - the "data-role" API has been deprecated.
          Please use the \`renderTrigger\` and \`renderMenu\` props.
          See documentation for details:
          https://github.com/folio-org/stripes-components/blob/popdown/lib/Dropdown/readme.md`);
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
    return ({ onToggle, keyHandler }) => {
      return cloneElement(
        this.menuChild,
        { onClick: isBoolean(this.props.open) ? this.handleToggle : onToggle,
          onKeyDown: keyHandler }
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
      },
    );

    // if the tether prop was actually used
    if (!isEqual(tether, Dropdown.defaultProps.tether)) {
      console.warn('tether functionality of Dropdown is deprecated and will be removed in future versions.');
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
          usePortal={isBoolean(usePortal) ? usePortal : true}
          triggerKeyHandler={triggerHandleKeyDown}
          triggerRef={this._toggle}
          menuKeyHandler={menuHandleKeyDown}
          placement={placement}
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
