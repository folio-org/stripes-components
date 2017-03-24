//Using react-bootstrap's dropdown...
import React from 'react';
import ReactDOM from 'react-dom'
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper'
import css from './DropdownMenu.css'

const propTypes={
  pullRight:React.PropTypes.bool,
  width: React.PropTypes.string,
};

class DropdownMenu extends React.Component {
  constructor(props) {
    super(props);
    
    //this.handleKeyDown = this.handleKeyDown.bind(this);
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

    const prevIndex = activeIndex === 0 ? items.length -1 : activeIndex - 1;
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
    const {bsRole, onSelect, onToggle, open, pullRight, bsClass, labelledBy, onClose, rootCloseEvent, ...ddprops} = this.props;
    
    var position = {
        left:pullRight ? 'initial':'0',
        display: this.props.open ? 'block':'none',
        right: pullRight ? '0':'initial',
        width: this.props.width || 'initial',
    };
    
    var menu = (
      <div className={css.DropdownMenu} style={position} {...ddprops}>
        {this.props.children}
      </div>
    )
    
    if(this.props.open){
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


