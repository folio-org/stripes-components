import React from 'react';
import Downshift from 'downshift';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import TetherComponent from 'react-tether';
import TextField from '../TextField';
import formField from '../FormField';
import css from './AutoSuggest.css';

const defaultProps = {
  includeItem: (item, searchString) => item.value.includes(searchString),
  onChange: () => {},
  onFocus: () => {},
  renderOption: item => (item ? item.value : ''),
  renderValue: item => (item ? item.value : ''),
  tether: {
    attachment: 'top left',
    renderElementTo: null,
    targetAttachment: 'bottom left',
    optimizations: {
      gpu: false,
    },
    constraints: [
      {
        to: 'scrollParent',
      },
    ],
  },
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
  renderOption: PropTypes.func,
  renderValue: PropTypes.func,
  required: PropTypes.bool,
  screenReaderMessage: PropTypes.string,
  tether: PropTypes.object,
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
    this.autoSuggestId = `list-dropdown-${this.testId}`;
  }

  getInputWidth = () => { // eslint-disable-line consistent-return
    if (this.container.current) {
      return this.container.current.offsetWidth;
    }
  }

  render() {
    const {
      error,
      includeItem,
      items,
      label,
      name,
      onBlur,
      onChange,
      onFocus,
      renderOption,
      renderValue,
      required,
      tether,
      validationEnabled,
      value,
      valueKey,
    } = this.props;

    const mergedTetherProps = { ...AutoSuggest.defaultProps.tether, ...tether };
    const testId = this.testId;
    const autoSuggestId = this.autoSuggestId;
    const inputProps = {
      autoComplete: 'off',
      required,
      label,
      name,
      validationEnabled,
      inputRef: this.textfield,
      id: testId,
      error,
    };

    return (
      <Downshift
        style={{ display: 'inline-block', position: 'relative' }}
        itemToString={renderValue}
        onChange={selectedItem => onChange(selectedItem[valueKey])}
        onStateChange={({ inputValue }) => onChange(inputValue)}
        selectedItem={value}
        inputValue={value}
      >
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          selectedItem,
          highlightedIndex,
          isOpen,
          inputValue,
        }) => (
          <div className={css.downshift} data-test-autosuggest>
            <TetherComponent {...mergedTetherProps}>
              <div
                className={css.textFieldDiv}
                ref={this.container}
                aria-live="assertive"
                aria-relevant="additions"
              >
                <TextField {...getInputProps(
                  { ...inputProps,
                    onBlur,
                    onFocus }
                )}
                />
              </div>
              <ul
                className={css.autoSuggest}
                {...getMenuProps({
                  id: autoSuggestId,
                  style: {
                    width: `${this.getInputWidth()}px`,
                    display: isOpen ? 'block' : 'none'
                  }
                }, { suppressRefError: true })}
              >
                {isOpen
                  ? items
                    .filter(item => !inputValue || includeItem(item, inputValue))
                    .map((item, index) => (
                      <li
                        {...getItemProps({
                          key: item[valueKey],
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
            </TetherComponent>
          </div>
        )
            }
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
    warning: (meta.touched && meta.warning ? meta.warning : ''),
  })
);
