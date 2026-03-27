// @ts-nocheck
import React from "react";
import css from "./Selection.css";
type SelectionListProps = {
  getMenuProps?: (...args: any[]) => any;
  isOpen?: boolean;
  labelId?: string;
  listMaxHeight?: string;
  renderOptions?: (...args: any[]) => any;
};

const SelectionList = ({
  getMenuProps,
  labelId,
  listMaxHeight,
  renderOptions,
  isOpen,
}: SelectionListProps) => (
  <ul
    {...getMenuProps({
      "aria-labelledby": labelId,
    })}
    style={{ maxHeight: listMaxHeight }}
    className={css.selectionList}
    tabIndex="-1"
  >
    {isOpen && renderOptions()}
  </ul>
);

export default SelectionList;
