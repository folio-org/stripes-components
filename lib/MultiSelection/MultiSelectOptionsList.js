import React from 'react';
import PropTypes from 'prop-types';
import findIndex from 'lodash/findIndex';
import isEqual from 'lodash/isEqual';
import Icon from '../Icon';
import SelectOption from './SelectOption';
import MultiSelectFilterField from './MultiSelectFilterField';
import css from './MultiSelect.css';

import OptionsListWrapper from './OptionsListWrapper';

class MultiSelectOptionsList extends React.Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      onSelect: PropTypes.func.isRequired,
    })),
    ariaLabelledBy: PropTypes.string,
    asyncFiltering: PropTypes.bool,
    atSmallMedia: PropTypes.bool,
    containerWidth: PropTypes.number,
    controlRef: PropTypes.object,
    downshiftActions: PropTypes.object,
    emptyMessage: PropTypes.node,
    error: PropTypes.node,
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
    itemToString: PropTypes.func,
    maxHeight: PropTypes.number,
    modifiers: PropTypes.object,
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
    useLegacy: PropTypes.bool,
    warning: PropTypes.node,
  }

  componentDidUpdate(prevProps) {
    if (this.props.atSmallMedia) {
      if (prevProps.isOpen !== this.props.isOpen) {
        if (this.props.isOpen) {
          if (this.props.inputRef && this.props.inputRef.current) {
            this.props.inputRef.current.focus();
          }
        } else if (this.props.controlRef && this.props.controlRef.current) {
          this.props.controlRef.current.focus();
        }
      }
    }
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

  getLoadingIcon = () => {
    const {
      asyncFiltering,
      renderedItems
    } = this.props;

    if (asyncFiltering && !renderedItems) {
      return <Icon icon="spinner-ellipsis" />;
    }
    return null;
  }

  render() {
    const {
      actions,
      ariaLabelledBy,
      atSmallMedia,
      controlRef,
      internalChangeCallback,
      exactMatch,
      getInputProps,
      inputRef,
      isOpen,
      itemToString,
      getMenuProps,
      getItemProps,
      selectedItems,
      highlightedIndex,
      inputValue,
      emptyMessage,
      modifiers,
      placeholder,
      renderedItems,
      error,
      warning,
      formatter,
      downshiftActions,
      useLegacy,
      renderToOverlay,
      disabled,
    } = this.props;

    const filterProps = {
      ariaLabelledBy,
      atSmallMedia,
      selectedItems,
      internalChangeCallback,
      backspaceDeletes: false,
      getInputProps,
      inputRef,
      placeholder,
    };

    return (
      <OptionsListWrapper
        className={css.multiSelectMenu}
        style={this.getMenuStyle()}
        modifiers={modifiers}
        isOpen={isOpen}
        controlRef={controlRef}
        useLegacy={(useLegacy || atSmallMedia)}
        renderToOverlay={renderToOverlay}
      >
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
        <ul style={this.getListStyle()} {...getMenuProps()} className={css.multiSelectOptionList}>
          { this.getLoadingIcon() }
          { renderedItems && renderedItems.length > 0 &&
          renderedItems.map((item, index) => (
            <SelectOption
              key={`${itemToString(item)}`}
              {...getItemProps({
                item,
                index,
                isDisabled: disabled,
                optionItem: item,
                isActive: highlightedIndex === index,
                isSelected: findIndex(selectedItems, (o) => isEqual(o, item)) !== -1,
              })}
            >
              {formatter({ option: item, searchTerm: inputValue })}
            </SelectOption>
          ))}
          {renderedItems && actions && actions.length > 0 && actions.map((item, index) => {
            const actionIndex = renderedItems.length + index;

            return (
              <SelectOption
                key={`${this.props.id}-action-${actionIndex}`}
                {...getItemProps({
                  item: { ...item, downshiftActions },
                  index: actionIndex,
                  optionItem: item,
                  isActive: highlightedIndex === actionIndex,
                })}
              >
                {
                item.render({
                  filterValue: inputValue,
                  exactMatch,
                  renderedItems,
                })
              }
              </SelectOption>
            );
          })
        }
        </ul>
      </OptionsListWrapper>
    );
  }
}

export default MultiSelectOptionsList;
