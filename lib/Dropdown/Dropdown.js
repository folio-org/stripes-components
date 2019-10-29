
import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';
import isEqual from 'lodash/isEqual';
import isBoolean from 'lodash/isBoolean';
import classNames from 'classnames';
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
  usePortal: PropTypes.boolean,
  pullRight: PropTypes.bool,
  renderTrigger: PropTypes.func,
  tag: PropTypes.string,
  tether: PropTypes.object,
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

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.state = { open: props.open };

    this.ariaProps = {
      'aria-expanded': this.state.open,
      'aria-haspopup': true
    };

    this.triggerNode = null;
    this.menuNode = null;
    this._renderTrigger = this._renderTrigger.bind(this);
    this.renderTetherChildren = this.renderTetherChildren.bind(this);
  }

  static getDerivedStateFromProps(props) {
    if (isBoolean(props.open)) {
      return { open: props.open }
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    // If the dropdown was just closed and the dropdown menu had focus, focus on the dropdown toggle button
    if (!this.props.open && prevProps.open) {
      if (this._menu && this._menu.node && this._menu.node.contains(document.activeElement)) {
        this.focus();
      }
    }
  }

  handleKeyDown(e) {
    if (this.props.disabled) {
      return;
    }

    switch (e.keyCode) {
      case 40: // down
        if (!this.props.open) {
          this.handleToggle(e);
        } else if (this._menu.focusNext) {
          this._menu.focusNext();
        }
        e.preventDefault();
        break;
      case 27: // escape
      case 9: // tab
        this.handleClose(e);
        break;
      default:
    }
  }

  focus() {
    const toggle = this._toggle;

    if (toggle && toggle.focus) {
      toggle.focus();
    }
  }

  handleClose(e) {
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

    return onToggle ? onToggle(e) : undefined;
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
          const triggerNode = cloneElement(child, {
            'ref': isStatefulComponent(child) ? (c) => { this._toggle = c; } : undefined,
            'onClick': this.handleToggle,
            'onKeyDown': this.handleKeyDown,
            'aria-expanded': open,
            'aria-haspopup': true,
            disabled,
          });
          this.triggerNode = triggerNode;
          return this.triggerNode;
        }
        case 'menu': {
          if (this.props.onSelectItem) {
            this.menuNode = cloneElement(child, {
              open,
              pullRight,
              labelledBy: id,
              className,
              onToggle: this.handleToggle,
              onSelectItem: this.props.onSelectItem,
              ref: isStatefulComponent(child) ? (c) => { this._menu = c; } : undefined,
            });
          }
          this.menuNode = cloneElement(child, {
            open,
            pullRight,
            labelledBy: id,
            className,
            onToggle: this.handleToggle,
            ref: isStatefulComponent(child) ? (c) => { this._menu = c; } : undefined,
          });
          return this.menuNode;
        }
        default: {
          return child;
        }
      }
    });
  }

  _renderTrigger = (triggerRef, toggleMenu, ariaProps) => {
    if (!this.triggerNode) return null;
    return cloneElement(
      this.triggerNode,
      { ref: triggerRef,
        onClick: isBoolean(this.props.open) ? this.handleToggle : toggleMenu,
        ...ariaProps }
    );
  }

  render() {
    const {
      className,
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
          renderTrigger={renderTrigger || this._renderTrigger}
          open={open}
          label={label}
          buttonProps={buttonProps}
          usePortal={usePortal || true}
        >
          {this.menuNode}
        </Popdown>
      </Tag>
    );
  }
}

Dropdown.propTypes = propTypes;
Dropdown.defaultProps = defaultProps;

export default Dropdown;
