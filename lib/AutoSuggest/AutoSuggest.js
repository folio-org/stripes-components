import React from 'react';
import Downshift from 'downshift';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';

import Popper from '../Popper';
import TextField from '../TextField';
import formField from '../FormField';
import parseMeta from '../FormField/parseMeta';
import css from './AutoSuggest.css';
import Label from '../Label';

const defaultProps = {
  includeItem: (item, searchString) => item.value.includes(searchString),
  onChange: () => { },
  onFocus: () => { },
  onSelect: () => { },
  renderOption: item => (item ? item.value : ''),
  renderValue: item => (item ? item.value : ''),
  valueKey: 'value',
  validationEnabled: true,
};

const propTypes = {
  error: PropTypes.node,
  id: PropTypes.string,
  includeItem: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  label: PropTypes.node,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onSelect: PropTypes.func,
  placeholder: PropTypes.string,
  popper: PropTypes.object,
  renderOption: PropTypes.func,
  renderValue: PropTypes.func,
  required: PropTypes.bool,
  screenReaderMessage: PropTypes.string,
  validationEnabled: PropTypes.bool,
  value: PropTypes.string,
  valueKey: PropTypes.string,
};

class AutoSuggest extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.textfield = React.createRef();
    this.testId = this.props.id || uniqueId('autoSuggest-');
  }

  getInputWidth = () => { // eslint-disable-line consistent-return
    if (this.container.current) {
      return this.container.current.offsetWidth;
    }
  }

  renderControl = (downshiftAPI) => {
    const {
      error,
      includeItem,
      items,
      label,
      name,
      onBlur,
      onFocus,
      placeholder,
      popper,
      renderOption,
      required,
      validationEnabled,
      valueKey,
    } = this.props;

    const {
      getInputProps,
      getItemProps,
      getLabelProps,
      getMenuProps,
      selectedItem,
      highlightedIndex,
      isOpen,
      inputValue,
    } = downshiftAPI;

    const testId = this.testId;

    const inputProps = {
      autoComplete: 'off',
      required,
      name,
      validationEnabled,
      inputRef: this.textfield,
      id: testId,
      error,
    };
    if (placeholder) {
      inputProps.placeholder = placeholder;
    }

    const labelProps = getLabelProps({
      htmlFor: testId
    });

    const control = (
      <div
        className={css.textFieldDiv}
        ref={this.container}
        aria-live="assertive"
        aria-relevant="additions"
      >
        { label && (
          <Label {...labelProps}>{label}</Label>
        )}
        <TextField
          {...getInputProps(
            {
              ...inputProps,
              onBlur,
              onFocus,
              // eslint-disable-next-line
              'data-test-autosuggest-input': true,
            }
          )}
          // eslint-disable-next-line jsx-a11y/aria-proptypes
          aria-labelledby={labelProps.id}
        />
      </div>
    );

    const list = (
      <ul
        className={css.autoSuggest}
        {...getMenuProps({
          style: {
            width: `${this.getInputWidth()}px`,
            visibility: isOpen ? 'visible' : 'hidden'
          }
        }, { suppressRefError: true })}
      >
        {isOpen
          ? items
            .filter(item => !inputValue || includeItem(item, inputValue))
            .map((item, index) => (
              <li
                {...getItemProps({
                  key: `${index}_${item[valueKey]}`,
                  index,
                  item,
                  style: {
                    padding: '1rem',
                    cursor: 'default',
                    display: 'flex',
                    justifyContent: 'space-between',
                    backgroundColor:
                      highlightedIndex === index ? 'lightgray' : 'white',
                    fontWeight: selectedItem === item ? 'bold' : 'normal',
                  },
                })}
              >
                {renderOption(item)}
              </li>
            ))
          : null}
      </ul>
    );

    return (
      <>
        {control}
        <Popper {...popper} hideIfClosed isOpen={isOpen} anchorRef={this.container}>
          {list}
        </Popper>
      </>
    );
  }

  render() {
    const {
      onChange,
      onSelect,
      renderValue,
      value,
      valueKey,
    } = this.props;

    return (
      <Downshift
        style={{ display: 'inline-block', position: 'relative' }}
        itemToString={renderValue}
        onChange={selectedItem => onChange(selectedItem[valueKey])}
        onInputValueChange={(inputValue) => onChange(inputValue)}
        selectedItem={value}
        inputValue={value}
        onSelect={onSelect}
      >
        {({ ...downshiftAPI }) => (
          // eslint-disable-next-line jsx-a11y/aria-proptypes
          <div className={css.downshift} data-test-autosuggest aria-labelledby={undefined}>
            {this.renderControl({
              ...downshiftAPI
            })}
          </div>
        )}
      </Downshift>
    );
  }
}

export default formField(
  AutoSuggest,
  ({ meta }) => ({
    dirty: meta.dirty,
    error: (meta.touched && meta.error ? meta.error : ''),
    valid: meta.valid,
    warning: (meta.touched ? parseMeta(meta, 'warning') : ''),
  })
);
