
import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';
import classNames from 'classnames';
import css from './Dropdown.css';
import omit from '../../util/omitProps';
import ddmenuCss from '../DropdownMenu/DropdownMenu.css';

const propTypes = {
  disabled: PropTypes.bool,
  open: PropTypes.bool,
  group: PropTypes.bool,
  onToggle: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  tether: PropTypes.shape({
    renderElementTo: PropTypes.string,
    attachment: PropTypes.string,
  }),
  pullRight: PropTypes.bool,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

const defaultProps = {
  open: false,
  tag: 'div',
};

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.addEvents = this.addEvents.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.removeEvents = this.removeEvents.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this._focusInDropdown = false;
    this.lastOpenEventType = null;
  }

  componentDidMount() {
    this.handleProps();
    this.focusNextOnOpen();
  }

  componentWillUpdate(nextProps) {
    if (!nextProps.open && this.props.open) {
      this._focusInDropdown = this._menu.node.contains(document.activeElement);
    }
  }

  componentDidUpdate(prevProps) {
    const { open } = this.props;
    const prevOpen = prevProps.open;

    if (open !== prevOpen) {
      this.handleProps();
    }

    if (open && !prevOpen) {
      this.focusNextOnOpen();
    }

    if (!open && prevOpen) {
      if (this._focusInDropdown) {
        this._focusInDropdown = false;
        this.focus();
      }
    }
  }

  componentWillUnmount() {
    this.removeEvents();
  }

  addEvents() {
    document.addEventListener('click', this.handleDocumentClick, true);
  }

  removeEvents() {
    document.removeEventListener('click', this.handleDocumentClick, true);
  }

  handleDocumentClick(e) {
    const container = this._dropdown;
    if (container.contains(e.target) && container !== e.target) {
      return;
    }

    this.handleToggle(e);
  }


  handleProps() {
    if (this.props.open) {
      this.addEvents();
    } else {
      this.removeEvents();
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

  focusNextOnOpen() {
    const menu = this._menu;

    if (!menu.focusNext) {
      return;
    }

    if (this.lastOpenEventType === 'keydown') {
      menu.focusNext();
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
    if (this.props.disabled || this.props.open) {
      return e && e.preventDefault();
    }

    return this.props.onToggle();
  }

  renderChildren() {
    const {
      className,
      open,
      pullRight,
      disabled,
      id,
      group,
      children,
      tether,
    } = this.props;
    const classes = classNames(
      className,
      {
        [css.DropdownMenuTether]: !group,
        [ddmenuCss.DropdownMenu]: group,
      },
    );
    const defaultTetherProps = {
      attachment: 'top center',
      renderElementTo: null,
      constraints: [{
        to: 'scrollParent',
        pin: true,
      }],
    };

    const tetherProps = Object.assign(defaultTetherProps, tether);

    const ddChildren = React.Children.map(React.Children.toArray(children), (child) => {
      switch (child.props['data-role']) {
        case 'toggle': {
          return cloneElement(child, {
            open,
            ref: (c) => { this._toggle = c; },
            disabled,
            onClick: this.handleToggle,
            onKeyDown: this.handleKeyDown,
          });
        }
        case 'menu': {
          const menuChild = cloneElement(child, {
            open,
            pullRight,
            labelledBy: id,
            className: classes,
            ref: (c) => { this._menu = c; },
          });
          return menuChild;
        }
        default: {
          return child;
        }
      }
    });

    if (!group) {
      return (
        <TetherComponent
          {...tetherProps}
        >
          {ddChildren}
        </TetherComponent>);
    }
    return ddChildren;
  }

  render() {
    const {
      className,
      tag: Tag,
      open,
      group,
      ...attributes
    } = omit(this.props, ['tether', 'onToggle', 'pullRight']);
    const classes = classNames(
      className,
      {
        [css.btnGroup]: group,
        [css.show]: open,
        [css.dropdown]: !group,
      },
    );

    return (
      <Tag
        {...attributes}
        className={classes}
        ref={(c) => { this._dropdown = c; }}
      >
        {this.renderChildren()}
      </Tag>
    );
  }
}

Dropdown.propTypes = propTypes;
Dropdown.defaultProps = defaultProps;

export default Dropdown;
