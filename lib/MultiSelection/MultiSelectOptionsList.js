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
    emptyMessage: PropTypes.string,
    error: PropTypes.string,
    exactMatch: PropTypes.bool,
    formatter: PropTypes.func,
    getItemProps: PropTypes.func,
    getMenuProps: PropTypes.func,
    highlightedIndex: PropTypes.number,
    id: PropTypes.string,
    inputValue: PropTypes.string,
    isOpen: PropTypes.bool,
    maxHeight: PropTypes.number,
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
    warning: PropTypes.string,
    width: PropTypes.number,
  }

  componentDidUpdate(prevProps) {
    if(this.props.atSmallMedia) {
      if (prevProps.isOpen !== this.props.isOpen) {
        if (this.props.isOpen) {
          this.props.inputRef.current.focus();
        } else {
          this.props.containerRef.current.focus();
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
    const style = {}
    if(!this.props.atSmallMedia) {
      style.width = `${this.props.inputWidth}px`;
    }
    return style;
  }

  getPlaceholder = () => {
    if (this.props.atSmallMedia) {
      return 'filter option list';
    } else if (this.props.selectedItems.length === 0){
      return this.props.placeholder;
    } else {
      return '';
    }
  } 

  getListStyle = () => {
    const style = {}
    if (this.props.atSmallMedia) {
      style.maxHeight = '60vh'
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
      maxHeight,
      width,
      error,
      warning,
      formatter,
      placeholder,
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
        {renderedItems.length === 0 &&
          <div className={css.multiSelectStatus}>{emptyMessage}</div>
        }
        {error && <div className={css.multiSelectError}>{error}</div>}
        {warning && <div className={css.multiSelectError}>{warning}</div>}
      </div>
      <ul style={this.getListStyle()} className={css.multiSelectOptionList}>
        {renderedItems.length > 0 &&
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
          {actions.length > 0 && actions.map((item, index) =>
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
