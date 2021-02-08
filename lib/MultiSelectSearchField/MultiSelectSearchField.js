/**
 * SearchField
 *
 * A universal search field component
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl } from 'react-intl';

import TextField from '../TextField';
import Select from '../Select';
import TextFieldIcon from '../TextField/TextFieldIcon';
import MultiSelectSearch from './components/MultiSelectSearch';
import css from './MultiSelectSearchField.css';

// Accepts the same props as TextField
const propTypes = {
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  clearSearchId: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  inputClass: PropTypes.string,
  inputRef: PropTypes.object,
  isAdvancedSearch: PropTypes.bool,
  loading: PropTypes.bool,
  onChange: PropTypes.func,
  onChangeIndex: PropTypes.func,
  onClear: PropTypes.func,
  placeholder: PropTypes.string,
  searchableIndexes: PropTypes.arrayOf(PropTypes.shape({
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
  })),
  searchableIndexesPlaceholder: PropTypes.string,
  searchButtonRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  selectedIndex: PropTypes.string,
  value: PropTypes.string,
};

const MultiSelectSearchField = (props) => {
  const {
    className,
    placeholder,
    id,
    ariaLabel,
    value,
    onChange,
    onClear,
    loading,
    clearSearchId,
    searchableIndexes,
    onChangeIndex,
    selectedIndex,
    searchableIndexesPlaceholder,
    inputClass,
    disabled,
    isAdvancedSearch,
    searchButtonRef,
    ...rest
  } = props;

  /**
   * Search field has searchable indexes dropdown
   */
  let searchableIndexesDropdown;
  const hasSearchableIndexes = Array.isArray(searchableIndexes);
  const intl = useIntl();

  if (hasSearchableIndexes) {
    const indexLabel = intl.formatMessage({ id: 'stripes-components.searchFieldIndex' });

    searchableIndexesDropdown = (
      <Select
        aria-label={indexLabel}
        dataOptions={searchableIndexes}
        disabled={loading}
        id={`${id}-qindex`}
        marginBottom0
        onChange={onChangeIndex}
        placeholder={searchableIndexesPlaceholder}
        selectClass={css.select}
        value={selectedIndex}
      />
    );
  }

  // Wrapper styles
  const rootStyles = classNames(
    css.searchFieldWrap,
    { [css.hasSearchableIndexes]: hasSearchableIndexes },
    className,
  );

  // Search icon
  const searchIcon = (<TextFieldIcon iconClassName={css.searchIcon} icon="search" />);

  // Placeholder
  let inputPlaceholder = placeholder;
  if (!placeholder && hasSearchableIndexes && selectedIndex) {
    const selectedIndexConfig = searchableIndexes.find(index => index.value === selectedIndex) || {};
    inputPlaceholder = selectedIndexConfig.placeholder || '';
  }

  return (
    <div className={rootStyles}>
      {searchableIndexesDropdown}
      {isAdvancedSearch
        ? (
          <MultiSelectSearch
            onChange={onChange}
            searchButtonRef={searchButtonRef}
          />
        )
        : (
          <TextField
            {...rest}
            aria-label={rest['aria-label'] || ariaLabel}
            clearFieldId={clearSearchId}
            disabled={disabled}
            focusedClass={css.isFocused}
            id={id}
            hasClearIcon={typeof onClear === 'function' && loading !== true}
            inputClass={classNames(css.input, inputClass)}
            loading={loading}
            onChange={onChange}
            onClearField={onClear}
            placeholder={inputPlaceholder}
            startControl={!hasSearchableIndexes ? searchIcon : null}
            type="search"
            value={value || ''}
            readOnly={loading || rest.readOnly}
          />
        )
      }
    </div>
  );
};

MultiSelectSearchField.propTypes = propTypes;
MultiSelectSearchField.defaultProps = {
  loading: false,
};

export default MultiSelectSearchField;
