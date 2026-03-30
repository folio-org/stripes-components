// @ts-nocheck
/**
 * SearchField
 *
 * A universal search field component
 */

import React from "react";
import classNames from "classnames";
import { useIntl } from "react-intl";
import noop from "lodash/noop";

import TextField from "../TextField";
import TextArea from "../TextArea";
import Select from "../Select";
import TextFieldIcon from "../TextField/TextFieldIcon";

import css from "./SearchField.css";
type SearchFieldProps = {
  ariaLabel?: string;
  className?: string;
  clearSearchId?: string;
  disabled?: boolean;
  id?: string;
  indexLabel?: string;
  indexName?: string;
  indexRef?: ((...args: any[]) => any) | { current?: Element };
  inputClass?: string;
  inputRef?: ((...args: any[]) => any) | { current?: Element };
  inputType?: any;
  isCursorAtEnd?: boolean;
  loading?: boolean;
  lockWidth?: boolean;
  newLineOnShiftEnter?: boolean;
  onChange?: (...args: any[]) => any;
  onChangeIndex?: (...args: any[]) => any;
  onClear?: (...args: any[]) => any;
  onSubmitSearch?: (...args: any[]) => any;
  placeholder?: string;
  searchableIndexes?: {
    disabled?: boolean;
    id?: string;
    label?: string;
    placeholder?: string;
    value?: string;
  }[];
  searchableIndexesPlaceholder?: string;
  searchableOptions?: React.ReactNode | React.ReactNode[];
  selectedIndex?: string;
  value?: string;
};

const INPUT_TYPES = {
  INPUT: "input",
  TEXTAREA: "textarea",
};

const INPUT_COMPONENTS = {
  [INPUT_TYPES.INPUT]: TextField,
  [INPUT_TYPES.TEXTAREA]: TextArea,
};

const TEXTAREA_DEFAULT_HEIGHT = 1;

// Accepts the same props as TextField

const SearchField = (props: SearchFieldProps) => {
  const {
    className,
    placeholder,
    id,
    ariaLabel,
    indexLabel: indexLabelProp,
    indexName,
    value,
    onChange,
    onClear,
    loading = false,
    clearSearchId,
    searchableIndexes,
    searchableOptions = null,
    onChangeIndex,
    selectedIndex,
    searchableIndexesPlaceholder,
    inputClass,
    disabled,
    inputType = INPUT_TYPES.INPUT,
    onSubmitSearch = noop,
    lockWidth = false,
    newLineOnShiftEnter = false,
    inputRef,
    indexRef,
    isCursorAtEnd = false,
    ...rest
  } = props;

  /**
   * Search field has searchable indexes dropdown
   */
  let searchableIndexesDropdown;
  const hasSearchableIndexes = Array.isArray(searchableIndexes);
  const intl = useIntl();

  if (hasSearchableIndexes || searchableOptions) {
    const indexLabel =
      indexLabelProp ||
      intl.formatMessage({ id: "stripes-components.searchFieldIndex" });

    searchableIndexesDropdown = (
      <Select
        aria-label={indexLabelProp || indexLabel}
        dataOptions={searchableOptions ? undefined : searchableIndexes}
        disabled={loading}
        id={`${id}-qindex`}
        marginBottom0
        onChange={onChangeIndex}
        placeholder={searchableIndexesPlaceholder}
        selectClass={css.select}
        value={selectedIndex}
        name={indexName}
        inputRef={indexRef}
      >
        {searchableOptions}
      </Select>
    );
  }

  // Wrapper styles
  const rootStyles = classNames(
    css.searchFieldWrap,
    { [css.hasSearchableIndexes]: hasSearchableIndexes },
    className,
  );

  // Search icon
  const searchIcon = (
    <TextFieldIcon iconClassName={css.searchIcon} icon="search" />
  );

  // Placeholder
  let inputPlaceholder = placeholder;
  if (!placeholder && hasSearchableIndexes && selectedIndex) {
    const selectedIndexConfig =
      searchableIndexes.find((index) => index.value === selectedIndex) || {};
    inputPlaceholder = selectedIndexConfig.placeholder || "";
  }

  const getInputComponentProps = () => {
    // TextField and TextArea have slightly different APIs so we need to pass props correctly
    const commonProps = {
      ...rest,
      "aria-label": rest["aria-label"] || ariaLabel,
      disabled,
      id,
      loading,
      onChange,
      startControl:
        !hasSearchableIndexes && !searchableOptions ? searchIcon : null,
      type: "search",
      value: value || "",
      readOnly: loading || rest.readOnly,
      placeholder: inputPlaceholder,
      inputRef,
      hasClearIcon: typeof onClear === "function",
      clearFieldId: clearSearchId,
      onClearField: onClear,
    };

    const textFieldProps = {
      focusedClass: css.isFocused,
      inputClass: classNames(css.input, inputClass),
    };
    const textAreaProps = {
      "aria-label": rest["aria-label"] || ariaLabel,
      rootClass: rest.className,
      lockWidth,
      onSubmitSearch,
      newLineOnShiftEnter,
      rows: TEXTAREA_DEFAULT_HEIGHT,
      isCursorAtEnd,
    };

    return {
      ...commonProps,
      ...(inputType === INPUT_TYPES.INPUT ? textFieldProps : {}),
      ...(inputType === INPUT_TYPES.TEXTAREA ? textAreaProps : {}),
    };
  };

  const Component = INPUT_COMPONENTS[inputType];

  return (
    <div className={rootStyles}>
      {searchableIndexesDropdown}
      <Component {...getInputComponentProps()} />
    </div>
  );
};

export default SearchField;
