
import React, { cloneElement } from 'react';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import PropTypes from 'prop-types';
import separateComponentProps from '../../util/separateComponentProps';
import MenuItem from '../MenuItem';
import css from './DropdownMenu.css';

const propTypes = {
  bsClass: PropTypes.string,
  bsRole: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  labelledBy: PropTypes.string,
  minWidth: PropTypes.string,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  onSelectItem: PropTypes.func,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
  overrideStyle: PropTypes.object,
  pullRight: PropTypes.bool,
  rootCloseEvent: PropTypes.string,
  width: PropTypes.string,
};

const defaultProps = {
  overrideStyle: {},
};

class DropdownMenu extends React.Component {
  getItemsAndActiveIndex() {
    const items = this.getFocusableMenuItems();
    const activeIndex = items.indexOf(document.activeElement);

    return { items, activeIndex };
  }

  getFocusableMenuItems() {
    if (!this.node) {
      return [];
    }

    return Array.from(this.node.querySelectorAll('button, input, a, select, [tabIndex="-1"]'));
  }

  focusNext() {
    const { items, activeIndex } = this.getItemsAndActiveIndex();
    if (items.length === 0) {
      return;
    }

    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    items[nextIndex].focus();
  }

  focusPrev() {
    const { items, activeIndex } = this.getItemsAndActiveIndex();
    if (items.length === 0) {
      return;
    }

    const prevIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    items[prevIndex].focus();
  }

  renderChildren() {
    const { children, onSelectItem, onSelect } = this.props;
    return React.Children.map(React.Children.toArray(children), (child) => {
      if (child.type === MenuItem) {
        return cloneElement(child,
          Object.assign(
            {},
            child.props,
            {
              onSelectItem,
              onSelect,
            },
          ),
          child.props.children);
      }
      return child;
    });
  }

  render() {
    const { onToggle, pullRight } = this.props;
    // eslint-disable-next-line react/forbid-foreign-prop-types
    const [, ddprops] = separateComponentProps(this.props, DropdownMenu.propTypes);
    const position = Object.assign({
      left: pullRight ? 'initial' : '0',
      display: this.props.open ? 'block' : 'none',
      right: pullRight ? '0' : 'initial',
      width: this.props.width || 'initial',
      minWidth: this.props.minWidth || null,
    }, this.props.overrideStyle);

    const menu = (
      <div className={css.DropdownMenu} style={position} {...ddprops} ref={(node) => { this.node = node; }}>
        {this.renderChildren()}
      </div>
    );

    if (this.props.open) {
      return (
        <RootCloseWrapper onRootClose={onToggle}>
          {menu}
        </RootCloseWrapper>
      );
    }

    return menu;
  }
}

DropdownMenu.propTypes = propTypes;
DropdownMenu.defaultProps = defaultProps;

export default DropdownMenu;
