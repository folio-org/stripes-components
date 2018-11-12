import React from 'react';
import Downshift from 'downshift';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import TetherComponent from 'react-tether';
import TextField from '../TextField';
import reduxFormField from '../ReduxFormField';
import css from './AutoSuggest.css';

const defaultProps = {
  includeItem: (item, searchString) => item.value.includes(searchString),
  onChange: () => {},
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
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
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
    this.testId = this.props.id || uniqueId('detailname-');
    this.autoSuggestId = `list-dropdown-${this.testId}`;
  }

  getInputWidth() { // eslint-disable-line consistent-return
    if (this.textfield.current) {
      const { input : { current : { offsetWidth } } } = this.textfield.current;
      return offsetWidth;
    }
  }

  render() {
    const {
      error,
      includeItem,
      items,
      label,
      onBlur,
      onChange,
      renderOption,
      renderValue,
      required,
      tether,
      validationEnabled,
      value,
      valueKey,
    } = this.props;

    const textfieldRef = this.textfield;
    const mergedTetherProps = { ...AutoSuggest.defaultProps.tether, ...tether };
    const testId = this.testId;
    const autoSuggestId = this.autoSuggestId;
    const listWidth = this.getInputWidth();
    const inputProps = {
      autoComplete: 'off',
      required,
      label,
      validationEnabled,
      ref: textfieldRef,
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
          <div className={css.downshift}>
            <TetherComponent {...mergedTetherProps}>
              <div
                className={css.TextFieldDiv}
                ref={(ref) => { this.container = ref; }}
                aria-live="assertive"
                aria-relevant="additions"
              >
                <TextField {...getInputProps(
                  { ...inputProps,
                    onBlur }
                )}
                />
              </div>
              <ul
                className={css.AutoSuggest}
                {...getMenuProps({
                  id: autoSuggestId,
                  style: { width: `${listWidth}px` }
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

export default reduxFormField(
  AutoSuggest,
  ({ meta }) => ({
    dirty: meta.dirty,
    error: (meta.touched && meta.error ? meta.error : ''),
    loading: meta.asyncValidating,
    touched: meta.touched,
    valid: meta.valid,
    warning: (meta.touched && meta.warning ? meta.warning : ''),
  })
);
