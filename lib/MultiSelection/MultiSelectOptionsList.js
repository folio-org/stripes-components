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
    }
    )),
    exactMatch: PropTypes.bool,
    emptyMessage: PropTypes.string,
    getMenuProps: PropTypes.func,
    getItemProps: PropTypes.func,
    selectedItems: PropTypes.array,
    renderedItems: PropTypes.array,
    highlightedIndex: PropTypes.number,
    inputValue: PropTypes.string,
    id: PropTypes.string,
    maxHeight: PropTypes.number,
    width: PropTypes.number,
    error: PropTypes.string,
    warning: PropTypes.string,
    formatter: PropTypes.func,
  }

  getMenuClass = () => {
    return classnames(
      css.multiSelectMenu,
      {[`${css.untethered}`]: !this.props.renderToOverlay }
    );
  }

  render() {
    const {
      actions,
      exactMatch,
      id,
      isOpen,
      getMenuProps,
      getItemProps,
      selectedItems,
      highlightedIndex,
      inputValue,
      emptyMessage,
      renderedItems,
      maxHeight,
      width,
      error,
      warning,
      formatter,
    } = this.props;

    return (
      <div className={this.getMenuClass()} {...getMenuProps()} hidden={!isOpen} style={{ width: `${width}px` }} id={id}>
      <div role="alert" className={css.multiSelectFeedback}>
        {renderedItems.length === 0 &&
          <div className={css.multiSelectStatus}>{emptyMessage}</div>
        }
        {error && <div className={css.multiSelectError}>{error}</div>}
        {warning && <div className={css.multiSelectError}>{warning}</div>}
      </div>
      <ul style={{maxHeight: `${maxHeight}px`}} className={css.multiSelectOptionList}>
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
              {formatter({ option:item, searchTerm:inputValue })}
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
  )}
}

export default MultiSelectOptionsList;
