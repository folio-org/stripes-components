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
    onSelect: PropTypes.func,
    onStateChange: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.object),
    ]),
  };

  state = { selectedItems: this.props.value };

  stateReducer(state, changes) {
    switch (changes.type) {
      case Downshift.stateChangeTypes.blurInput:
        if (!changes.selectedItem) {
          return {
            isOpen: false
          };
        }
        return {};
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        if (Object.prototype.hasOwnProperty.call(changes.selectedItem, 'onSelect')) {
          // const { downshiftActions } = changes.selectedItem;
          const params = {
            ...state,
            ...this.actionHelpers(),
            filterValue: state.inputValue
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

  changeCallback = (downshift) => {
    if (this.props.onSelect) {
      this.props.onSelect(
        this.state.selectedItems,
        this.getStateAndHelpers(downshift)
      );
    }
    if (this.props.onChange) {
      this.props.onChange(
        this.state.selectedItems,
        this.getStateAndHelpers(downshift)
      );
    }
  };

  handleSelection = (selectedItem, downshift) => {
    if (findIndex(this.state.selectedItems, (item) => isEqual(item, selectedItem)) !== -1) {
      this.removeItem(selectedItem, () => { this.changeCallback(downshift); });
    } else {
      this.addSelectedItem(selectedItem, () => { this.changeCallback(downshift); });
    }
  };

  removeItem = (item, cb) => {
    this.setState(({ selectedItems }) => {
      return {
        selectedItems: selectedItems.filter(i => !isEqual(i, item))
      };
    }, cb);
  };

  addSelectedItem(item, cb) {
    this.setState(
      ({ selectedItems }) => ({
        selectedItems: [...selectedItems, item]
      }),
      cb
    );
  }

  getSelectedItems = () => this.state.selectedItems;

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
    const { selectedItems } = this.state;
    const { getRemoveButtonProps, removeItem } = this;
    const { actionHelpers } = this.props;
    const stateAndHelpers = {
      getRemoveButtonProps,
      removeItem,
      selectedItems,
      filterValue: downshift.inputValue,
      removeButtonUsed: -1,
      internalChangeCallback: () => { this.changeCallback(downshift); },
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
