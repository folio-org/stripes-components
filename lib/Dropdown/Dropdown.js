
import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';
import classNames from 'classnames';
import css from './Dropdown.css';
import omit from '../../util/omitProps';
import { isStatefulComponent } from '../../util/isStatefulComponent';

const propTypes = {
  disabled: PropTypes.bool,
  open: PropTypes.bool,
  hasPadding: PropTypes.bool,
  onToggle: PropTypes.func,
  onSelect: PropTypes.func,
  onSelectItem: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  dropdownClass: PropTypes.string,
  tether: PropTypes.object,
  pullRight: PropTypes.bool,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  tag: PropTypes.string,
};

const defaultProps = {
  open: false,
  hasPadding: false,
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
    this._focusInDropdown = false;
  }

  componentWillUpdate(nextProps) {
    if (!nextProps.open && this.props.open) {
      this._focusInDropdown = this._menu.node ? this._menu.node.contains(document.activeElement) : false;
    }
  }

  componentDidUpdate(prevProps) {
    const { open } = this.props;
    const prevOpen = prevProps.open;

    if (!open && prevOpen) {
      if (this._focusInDropdown) {
        this._focusInDropdown = false;
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
    if (this.props.disabled) {
      return e && e.preventDefault();
    }
    if (e) { e.stopPropagation(); }
    return this.props.onToggle(e);
  }

  renderChildren() {
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
          return cloneElement(child, {
            'ref': isStatefulComponent(child) ? (c) => { this._toggle = c; } : undefined,
            disabled,
            'onClick': this.handleToggle,
            'onKeyDown': this.handleKeyDown,
            'aria-expanded': open,
            'aria-haspopup': true,
          });
        }
        case 'menu': {
          if (this.props.onSelectItem) {
            return cloneElement(child, {
              open,
              pullRight,
              labelledBy: id,
              className,
              onToggle: this.handleToggle,
              onSelectItem: this.props.onSelectItem,
              ref: isStatefulComponent(child) ? (c) => { this._menu = c; } : undefined,
            });
          }
          return cloneElement(child, {
            open,
            pullRight,
            labelledBy: id,
            className,
            onToggle: this.handleToggle,
            ref: isStatefulComponent(child) ? (c) => { this._menu = c; } : undefined,
          });
        }
        default: {
          return child;
        }
      }
    });
  }

  render() {
    const {
      className,
      tag: Tag,
      open,
      group,
      tether,
      hasPadding,
      dropdownClass,
      ...attributes
    } = omit(this.props, ['onToggle', 'onSelectItem', 'pullRight', 'dropdown', 'hasPadding']);
    const classes = classNames(
      className,
      {
        [css.hasPadding]: hasPadding,
        [css.btnGroup]: group,
        [css.show]: open,
        [css.dropdown]: !group,
      },
    );

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
        ref={(c) => { this._dropdown = c; }}
      >
        <TetherComponent
          {...mergedTetherProps}
        >
          {this.renderChildren()}
        </TetherComponent>
      </Tag>
    );
  }
}

Dropdown.propTypes = propTypes;
Dropdown.defaultProps = defaultProps;

export default Dropdown;
