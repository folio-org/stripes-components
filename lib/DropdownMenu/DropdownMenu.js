// Using react-bootstrap's dropdown...
import React from 'react';
import ReactDOM from 'react-dom';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import PropTypes from 'prop-types';
import separateComponentProps from '../../util/separateComponentProps';
import css from './DropdownMenu.css';

const propTypes = {
  pullRight: PropTypes.bool,
  width: PropTypes.string,
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
  constructor(props) {
    super(props);

    // this.handleKeyDown = this.handleKeyDown.bind(this);
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

  getItemsAndActiveIndex() {
    const items = this.getFocusableMenuItems();
    const activeIndex = items.indexOf(document.activeElement);

    return { items, activeIndex };
  }

  getFocusableMenuItems() {
    const node = ReactDOM.findDOMNode(this);
    if (!node) {
      return [];
    }

    return Array.from(node.querySelectorAll('button, input, a, select, [tabIndex="-1"]'));
  }

  render() {
    const { onToggle, pullRight } = this.props;
    const [, ddprops] = separateComponentProps(this.props, DropdownMenu.propTypes);
    const position = {
      left: pullRight ? 'initial' : '0',
      display: this.props.open ? 'block' : 'none',
      right: pullRight ? '0' : 'initial',
      width: this.props.width || 'initial',
    };

    const menu = (
      <div className={css.DropdownMenu} style={position} {...ddprops}>
        {this.props.children}
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

export default DropdownMenu;
