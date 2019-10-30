
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


function handleKeyDown(e, open, disabled, onToggle, menuRef, onClose) {
  if (disabled) {
    return;
  }

  switch (e.keyCode) {
    case 40: // down
      if (!open) {
        onToggle(e);
      } else if (menuRef.current && menuRef.current.focusNext) {
        menuRef.current.focusNext();
      }
      e.preventDefault();
      break;
    case 27: // escape
    case 9: // tab
      onClose(e);
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
    handleKeyDown(
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
      if (this.props.open) {
        if (this._menu.current && contains(this._menu.current.node, document.activeElement)) {
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
    return (triggerRef, toggleMenu, ariaProps, keyHandler) => {
      return cloneElement(
        this.triggerChild,
        { ref: triggerRef,
          onClick: isBoolean(this.props.open) ? this.handleToggle : toggleMenu,
          onKeyDown: keyHandler,
          ...ariaProps }
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
      buttonProps,
      hasPadding,
      dropdownClass,
      renderTrigger,
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
          overlayRef={this._menu}
          open={open}
          label={label}
          onToggle={this.props.onToggle}
          buttonProps={buttonProps}
          usePortal={usePortal || true}
          keyHandler={handleKeyDown}
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
