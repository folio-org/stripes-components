import React from 'react';
import PropTypes from 'prop-types';
import css from './MultiSelect.css';

class MultiSelectFilterField extends React.Component {
  static propTypes = {
    atSmallMedia: PropTypes.bool,
    backspaceDeletes: PropTypes.bool,
    getInputProps: PropTypes.func,
    inputRef: PropTypes.object,
    internalChangeCallback: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onRemove: PropTypes.func,
    optionsLength: PropTypes.number,
    placeholder: PropTypes.string,
    removeItem: PropTypes.func,
    selectedItems: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.object)
    ]),
    setHighlightedIndex: PropTypes.func,
  }

  handleInputKeyDown = (event) => {
    const {
      atSmallMedia,
      internalChangeCallback,
      removeItem,
      onRemove,
      optionsLength,
      selectedItems,
    } = this.props;

    if (event.keyCode === 8 && event.target.value.length === 0) { // backspace
      if (this.props.backspaceDeletes && !atSmallMedia) {
        removeItem(selectedItems[selectedItems.length - 1], internalChangeCallback);
        onRemove(selectedItems[selectedItems.length - 1]);
      }
    }
    if (event.keyCode === 36) { // Home
      this.props.setHighlightedIndex(0);
    }
    if (event.keyCode === 35) { // End
      this.props.setHighlightedIndex(optionsLength - 1);
    }
  }

  render() {
    const {
      getInputProps,
      onFocus,
      onBlur,
      placeholder,
      inputRef,
    } = this.props;

    return (
      <input
        {...getInputProps({
          type: 'text',
          ref: inputRef,
          onKeyDown: this.handleInputKeyDown,
          onFocus,
          onBlur,
          placeholder,
          className: css.multiSelectInput,
        })}
      />
    );
  }
}

export default MultiSelectFilterField;
