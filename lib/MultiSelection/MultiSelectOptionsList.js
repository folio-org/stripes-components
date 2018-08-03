import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import findIndex from 'lodash/findIndex';
import SelectOption from './SelectOption';
import css from './MultiSelect.css';

class MultiSelectOptionsList extends React.Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      onSelect: PropTypes.func.isRequired,
    })),
    atSmallMedia: PropTypes.bool,
    changeCallback: PropTypes.func,
    controlRef: PropTypes.object,
    emptyMessage: PropTypes.string,
    error: PropTypes.string,
    exactMatch: PropTypes.bool,
    formatter: PropTypes.func,
    getInputProps: PropTypes.func,
    getItemProps: PropTypes.func,
    getMenuProps: PropTypes.func,
    highlightedIndex: PropTypes.number,
    id: PropTypes.string,
    inputKeyDown: PropTypes.func,
    inputRef: PropTypes.object,
    inputValue: PropTypes.string,
    inputWidth: PropTypes.number,
    isOpen: PropTypes.bool,
    maxHeight: PropTypes.number,
    placeholder: PropTypes.string,
    removeItem: PropTypes.func,
    renderedItems: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.object)
    ]),
    renderToOverlay: PropTypes.bool,
    selectedItems: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.object)
    ]),
    setHighlightedIndex: PropTypes.func,
    warning: PropTypes.string,
  }

  componentDidUpdate(prevProps) {
    if (this.props.atSmallMedia) {
      if (prevProps.isOpen !== this.props.isOpen) {
        if (this.props.isOpen) {
          this.props.inputRef.current.focus();
        } else {
          this.props.controlRef.current.focus();
        }
      }
    }
  }

  getMenuClass = () => {
    return classnames(
      css.multiSelectMenu,
      { [`${css.untethered}`]: !this.props.renderToOverlay }
    );
  }

  getMenuStyle = () => {
    const style = {};
    if (!this.props.atSmallMedia) {
      style.width = `${this.props.inputWidth}px`;
    } else {
      style.width = '100%';
    }
    return style;
  }

  getPlaceholder = () => {
    if (this.props.atSmallMedia) {
      return 'filter option list';
    } else if (this.props.selectedItems.length === 0) {
      return this.props.placeholder;
    } else {
      return '';
    }
  }

  getListStyle = () => {
    const style = {};
    if (this.props.atSmallMedia) {
      style.maxHeight = '60vh';
    } else {
      style.maxHeight = `${this.props.maxHeight}px`;
    }
    return style;
  }

  render() {
    const {
      actions,
      atSmallMedia,
      changeCallback,
      exactMatch,
      getInputProps,
      id,
      inputRef,
      isOpen,
      inputKeyDown,
      getMenuProps,
      getItemProps,
      selectedItems,
      setHighlightedIndex,
      highlightedIndex,
      inputValue,
      removeItem,
      emptyMessage,
      renderedItems,
      error,
      warning,
      formatter,
    } = this.props;

    return (
      <div className={this.getMenuClass()} {...getMenuProps()} hidden={!isOpen} style={this.getMenuStyle()} id={id}>
        {atSmallMedia &&
        <input
          {...getInputProps({
          type: 'text',
          ref: inputRef,
          onKeyDown: (event) => {
            inputKeyDown(event, removeItem, selectedItems, setHighlightedIndex, changeCallback);
          },
          placeholder: this.getPlaceholder(),
          className: css.multiSelectInput,
        })}
        />
      }
        <div role="alert" className={css.multiSelectFeedback}>
          {error && <div className={css.multiSelectError}>{error}</div>}
          {warning && <div className={css.multiSelectWarning}>{warning}</div>}
          {renderedItems && renderedItems.length === 0 &&
            <div className={css.multiSelectEmptyMessage}>{emptyMessage}</div>
          }
        </div>
        <ul style={this.getListStyle()} className={css.multiSelectOptionList}>
          { renderedItems && renderedItems.length > 0 &&
          renderedItems.map((item, index) => (
            <SelectOption
              key={`${item.label}`}
              {...getItemProps({
                item,
                index,
                optionItem: item,
                isActive: highlightedIndex === index,
                isSelected: findIndex(selectedItems, item) !== -1,
              })}
            >
              {formatter({ option: item, searchTerm: inputValue })}
            </SelectOption>
          ))}
          {actions && actions.length > 0 && actions.map((item, index) =>
            <SelectOption
              key={`${this.props.id}-action-${renderedItems.length + index}`}
              {...getItemProps({
              item,
              index: renderedItems.length + index,
              optionItem: item,
              isActive: highlightedIndex === renderedItems.length + index,
            })}
            >
              {
              item.render({
                inputValue,
                exactMatch,
                renderedItems,
              })
            }
            </SelectOption>)
        }
        </ul>
      </div>
    );
  }
}

export default MultiSelectOptionsList;
