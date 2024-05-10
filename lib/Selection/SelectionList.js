import React from "react";
import classnames from 'classnames';
import { flattenOptionList, reconcileReducedIndex } from "./utils";
import DefaultOptionFormatter from './DefaultOptionFormatter';
import css from './Selection.css';

const getClass = ({ value }, i, props) => {
  const { selectedItem, highlightedIndex } = props;
  if ( value === undefined ) {
    return ;
  }

  return classnames(
    css.option,
    { [css.cursor]: i === highlightedIndex},
    { [`${css.selected}`]: value === selectedItem?.value },
  );
}

const SelectionList = ({
  formatter = DefaultOptionFormatter,
  filteredOptions,
  searchTerm,
  getMenuProps,
  getItemProps,
  selectedItem,
  highlightedIndex,
  items,
}) => {
  const flattenedOptions = flattenOptionList(filteredOptions);
  if (flattenedOptions.length === 0) {
    return (
      <div>
        <span>No items found</span>
      </div>
    );
  }

  return (
    <ul
      {...getMenuProps()}
      className={css.selectionList}
    >
      {flattenedOptions.map((item, i) => {
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
    </ul>
  );
};

export default SelectionList;
