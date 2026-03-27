// @ts-nocheck
import React from "react";
import { FormattedMessage } from "react-intl";
import css from "./MultiSelect.css";
type SelectedValuesListProps = {
  id?: string;
  listRef?: ((...args: any[]) => any) | Record<string, any>;
  renderSelectedItems?: (...args: any[]) => any;
  valueDescriptionId?: string;
  valueLabelId?: string;
};

const SelectedValuesList = ({
  valueLabelId,
  valueDescriptionId,
  id,
  renderSelectedItems,
  listRef,
}: SelectedValuesListProps) => (
  <div className={css.multiSelectValueListContainer} id={id}>
    <span className="sr-only" id={valueLabelId}>
      <FormattedMessage id="stripes-components.multiSelection.removeSelectedButtonLabel" />
    </span>
    <span className="sr-only" id={valueDescriptionId}>
      <FormattedMessage id="stripes-components.multiSelection.removeSelectedButtonDescription" />
    </span>
    <ul className={css.multiSelectValueList} ref={listRef}>
      {renderSelectedItems()}
    </ul>
  </div>
);

export default SelectedValuesList;
