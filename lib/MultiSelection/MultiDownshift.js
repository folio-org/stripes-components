import React from 'react';
import PropTypes from 'prop-types';
import findIndex from 'lodash/findIndex';
import isEqual from 'lodash/isEqual';
import Downshift from 'downshift';

class MultiDownshift extends React.Component {
  static propTypes = {
    actionHelpers: PropTypes.func,
    children: PropTypes.func,
    downshiftRef: PropTypes.object,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
    onSelect: PropTypes.func,
    onStateChange: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.object),
    ]),
  };

  stateReducer(state, changes) {
    switch (changes.type) {
      case Downshift.stateChangeTypes.blurInput:
        if (!changes.selectedItem) {
          return {
            isOpen: false
          };
        }
        return {};
      case Downshift.stateChangeTypes.changeInput:
        return {
          ...changes,
          highlightedIndex: 0,
        };
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        if (Object.prototype.hasOwnProperty.call(changes.selectedItem, 'onSelect')) {
          const params = {
            ...state,
            ...this.actionHelpers(),
            filterText: state.inputValue
          };
          changes.selectedItem.onSelect(params);
          return {
            inputValue: '',
            isOpen: false
          };
        }
        return {
          ...changes,
          highlightedIndex: state.highlightedIndex,
          isOpen: true
        };
      default:
        return changes;
    }
  }

  changeCallback = (newValue, downshift) => {
    if (this.props.onSelect) {
      this.props.onSelect(
        newValue,
        this.getStateAndHelpers(downshift)
      );
    }
    if (this.props.onChange) {
      this.props.onChange(
        newValue,
        this.getStateAndHelpers(downshift)
      );
    }
  };

  handleSelection = (selectedItem, downshift) => {
    const { value, onRemove } = this.props;
    if (findIndex(value, (item) => isEqual(item, selectedItem)) !== -1) {
      this.removeItem(selectedItem, (newValue) => {
        this.changeCallback(newValue, downshift);
        if (onRemove) {
          onRemove(selectedItem, downshift);
        }
      });
    } else {
      this.addSelectedItem(selectedItem, (newValue) => { this.changeCallback(newValue, downshift); });
    }
  };

  removeItem = (item, cb = () => {}) => {
    const newValue = this.props.value.filter(i => !isEqual(i, item));
    cb(newValue);
  };

  addSelectedItem(item, cb = () => {}) {
    const newValue = [...this.props.value, item];
    cb(newValue);
  }

  getSelectedItems = () => this.props.value;

  getRemoveButtonProps = ({
    onClick,
    item,
    index,
    ...props
  } = {}) => {
    return {
      onClick: e => {
        // TODO: use something like downshift's composeEventHandlers utility instead
        if (onClick) {
          onClick(e);
        }
        e.stopPropagation();
        this.handleSelection(item, { removeButtonIndex: index });
      },
      ...props
    };
  };

  getStateAndHelpers(downshift) {
    const selectedItems = this.props.value;
    const { getRemoveButtonProps, removeItem } = this;
    const { actionHelpers } = this.props;
    const stateAndHelpers = {
      getRemoveButtonProps,
      removeItem,
      selectedItems,
      filterValue: downshift.inputValue,
      removeButtonUsed: -1,
      internalChangeCallback: (newValue) => { this.changeCallback(newValue, downshift); },
      ...actionHelpers(),
      ...downshift
    };
    return stateAndHelpers;
  }

  render() {
    const { children, ...props } = this.props;
    // TODO: compose together props (rather than overwriting them) like downshift does
    return (
      <Downshift
        {...props}
        ref={this.props.downshiftRef}
        stateReducer={this.stateReducer}
        onChange={this.handleSelection}
        defaultHighlightedIndex={0}
        selectedItem={null}
        onStateChange={this.props.onStateChange}
      >
        {downshift => children(this.getStateAndHelpers(downshift))}
      </Downshift>
    );
  }
}

export default MultiDownshift;
