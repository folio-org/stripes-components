import React from "react";
import { useIntl } from 'react-intl';
import classnames from 'classnames';
import { flattenOptionList, reconcileReducedIndex } from "./utils";
import DefaultOptionFormatter from './DefaultOptionFormatter';
import css from './Selection.css';

const getClass = (item, i, props) => {
  const { value } = item;
  const { selectedItem, highlightedIndex } = props;
  if ( value === undefined ) {
    return;
  }

  return classnames(
    css.option,
    { [css.cursor]: i === highlightedIndex},
    { [`${css.selected}`]: value === selectedItem?.value },
  );
}

const SelectionList = ({
  dataOptions,
  emptyMessage,
  formatter = DefaultOptionFormatter,
  filteredOptions,
  searchTerm,
  getMenuProps,
  getItemProps,
  selectedItem,
  highlightedIndex,
  items,
  loading,
  loadingMessage,
  listMaxHeight,
}) => {
  const { formatMessage } = useIntl();
  const renderOptions = () => {
    const flattenedOptions = flattenOptionList(filteredOptions);
    if (loading) {
      return (
        <li
          role="option"
          className={css.option}
        >
          <span>{loadingMessage}</span>
        </li>
      );
    }

    if (dataOptions.length === 0) {
      return (
        <li
          role="option"
          className={css.option}
        >
          <span>-{formatMessage({ id: 'stripes-components.selection.emptyList'})}-</span>
        </li>
      );
    }

    if (flattenedOptions.length === 0) {
      return (
        <li
          role="option"
          className={css.option}
        >
          <span>-{emptyMessage}-</span>
        </li>
      );
    }

    return flattenedOptions.map((item, i) => {
      if (item.value) {
        const reducedIndex = reconcileReducedIndex(item, items);
        return (
          <li
            key={`${item.label}-option-${i}`}
            {...getItemProps({ index: reducedIndex })}
            className={getClass(item, reducedIndex, { selectedItem, highlightedIndex })}
          >
            {formatter({option: item, searchTerm })}
          </li>
        )
      }
      return (
        <li
          key={`${item.label}-heading-${i}`}
          className={css.groupLabel}
        >
          {formatter({option: item, searchTerm })}
        </li>
      );
    })
  }

  return (
    <ul
      {...getMenuProps()}
      style={{ maxHeight: listMaxHeight }}
      className={css.selectionList}
    >
      {renderOptions()}
    </ul>
  );
};

export default SelectionList;
