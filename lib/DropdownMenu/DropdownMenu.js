
import React from 'react';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import PropTypes from 'prop-types';
import separateComponentProps from '../../util/separateComponentProps';
import css from './DropdownMenu.css';

const propTypes = {
  pullRight: PropTypes.bool,
  width: PropTypes.string,
  minWidth: PropTypes.string,
  bsRole: PropTypes.string,
  onSelect: PropTypes.func,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
  bsClass: PropTypes.string,
  labelledBy: PropTypes.string,
  onClose: PropTypes.func,
  rootCloseEvent: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
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

  render() {
    const { onSelect, onToggle, pullRight } = this.props;
    const [, ddprops] = separateComponentProps(this.props, DropdownMenu.propTypes);
    const position = {
      left: pullRight ? 'initial' : '0',
      display: this.props.open ? 'block' : 'none',
      right: pullRight ? '0' : 'initial',
      width: this.props.width || 'initial',
      minWidth: this.props.minWidth || null,
    };

    const menu = (
      <div className={css.DropdownMenu} style={position} {...ddprops} onClick={onSelect} ref={(node) => { this.node = node; }}>
        {this.props.children}
      </div>
    );

    if (this.props.open) {
      return (
        <RootCloseWrapper onRootClose={onToggle} >
          {menu}
        </RootCloseWrapper>
      );
    }

    return menu;
  }
}

DropdownMenu.propTypes = propTypes;

export default DropdownMenu;
