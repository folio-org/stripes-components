
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

function menuHandleKeyDown(e, open, disabled, onToggle, menuRef, onClose, triggerRef) {
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
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
      onClose(e);
      break;
    default:
  }
}

function triggerHandleKeyDown(e, open, disabled, onToggle) {
  if (disabled) {
    return;
  }

  switch (e.keyCode) {
    case 40: // down
      if (!open) {
        onToggle(e);
      }
      e.preventDefault();
      break;
    default:
  }
}

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.triggerChild = null;
    this.menuChild = null;
    this._menu = React.createRef();
    this._toggle = React.createRef();
    this._renderTrigger = this._renderTrigger.bind(this);
    this.renderTetherChildren = this.renderTetherChildren.bind(this);
  }

  _handleKeys = (e) => {
    triggerHandleKeyDown(
      e,
      this.props.open,
      this.props.disabled,
      this.handleToggle,
      this._menu,
      this.handleClose,
    );
  }

  focusTrigger() {
    const toggle = this._toggle;

    if (toggle && toggle.current) {
      toggle.current.focus();
    }
  }

  handleClose = (e) => {
    if (!this.props.open) {
      return;
    }

    this.handleToggle(e);
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
      if (this.props.open && this._menu.current) {
        const menuParent = this._menu.current.node || this._menu.current;
        if (contains(menuParent, document.activeElement)) {
          this.focusTrigger();
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
            'ref': this._toggle,
            'onClick': this.handleToggle,
            'onKeyDown': this._handleKeys,
            'aria-expanded': open,
            'aria-haspopup': true,
            disabled,
          });
          console.warn(`<Dropdown>: "data-role" API has been deprecated and will be removed in future releases.
          Use \`renderTrigger\` prop instead.
          See documentation for details:
          https://github.com/folio-org/stripes-components/blob/popdown/lib/Dropdown/readme.md`);
          return this.triggerChild;
        }
        case 'menu': {
          if (this.props.onSelectItem) {
            this.menuChild = cloneElement(child, {
              open,
              pullRight,
              labelledBy: id,
              className,
              onToggle: this.handleToggle,
              onSelectItem: this.props.onSelectItem,
              ref: isStatefulComponent(child) ? this._menu : undefined,
            });
          }
          this.menuChild = cloneElement(child, {
            open,
            pullRight,
            labelledBy: id,
            className,
            onToggle: this.handleToggle,
            ref: isStatefulComponent(child) ? this._menu : undefined,
          });
          console.warn(`<Dropdown>: "data-role" API has been deprecated and will be removed in future releases.
          Use \`renderMenu\` prop instead -or- have your menu as the only child of Dropdown.
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
          overlayRef={this._menu}
          open={open}
          label={label}
          onToggle={this.props.onToggle}
          buttonProps={buttonProps}
          usePortal={isBoolean(usePortal) ? usePortal : true}
          triggerKeyHandler={triggerHandleKeyDown}
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
