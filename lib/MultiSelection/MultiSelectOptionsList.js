import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import findIndex from 'lodash/findIndex';
import SelectOption from './SelectOption';
import MultiSelectFilterField from './MultiSelectFilterField';
import css from './MultiSelect.css';

class MultiSelectOptionsList extends React.Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      onSelect: PropTypes.func.isRequired,
    })),
    atSmallMedia: PropTypes.bool,
    containerWidth: PropTypes.number,
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
    internalChangeCallback: PropTypes.func,
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
      style.width = `${this.props.containerWidth}px`;
    } else {
      style.width = '100%';
    }
    return style;
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
      internalChangeCallback,
      exactMatch,
      getInputProps,
      id,
      inputRef,
      isOpen,
      getMenuProps,
      getItemProps,
      selectedItems,
      highlightedIndex,
      inputValue,
      emptyMessage,
      placeholder,
      renderedItems,
      error,
      warning,
      formatter,
    } = this.props;

    const filterProps = {
      atSmallMedia,
      selectedItems,
      internalChangeCallback,
      backspaceDeletes: false,
      getInputProps,
      ref: inputRef,
      placeholder,
    };

    return (
      <div className={this.getMenuClass()} {...getMenuProps()} hidden={!isOpen} style={this.getMenuStyle()} id={id}>
        {atSmallMedia &&
          <MultiSelectFilterField {...filterProps} />
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
