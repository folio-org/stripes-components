import React from 'react';
import Downshift from 'downshift';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import TetherComponent from 'react-tether';
import injectIntl from '@folio/stripes-components/lib/InjectIntl';
import TextField from '@folio/stripes-components/lib/TextField';
import reduxFormField from '@folio/stripes-components/lib/ReduxFormField';
import css from './AutoSuggest.css';

const defaultProps = {
  validationEnabled: true,
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
};

const propTypes = {
  error: PropTypes.string,
  id: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  label: PropTypes.string,
  meta: PropTypes.object,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  screenReaderMessage: PropTypes.string,
  tether: PropTypes.object,
  validationEnabled: PropTypes.bool,
  value: PropTypes.string,
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
    const { tether,
      items,
      label,
      value,
      required,
      validationEnabled, onBlur, error, onChange } = this.props;

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
        itemToString={item => (item ? item.value : '')}
        onChange={selectedItem => onChange(selectedItem.value)}
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
                  refKey: 'innerRef',
                  id: autoSuggestId,
                  style: { width: `${listWidth}px` }
                }, { suppressRefError: true })}
              >
                {isOpen
                  ? items
                    .filter(item => !inputValue || item.value.includes(inputValue))
                    .map((item, index) => (
                      <li
                        {...getItemProps({
                          key: item.value,
                          index,
                          item,
                          style: {
                            padding: '5px',
                            cursor: 'default',
                            display: 'flex',
                            justifyContent: 'space-between',
                            backgroundColor:
                                highlightedIndex === index ? 'lightgray' : 'white',
                            fontWeight: selectedItem === item ? 'bold' : 'normal',
                          },
                        })}
                      >
                        {item.value}
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
  injectIntl(
    AutoSuggest, { withRef: true }
  ), ({ input, meta }) => ({
    dirty: meta.dirty,
    error: (meta.touched && meta.error ? meta.error : ''),
    loading: meta.asyncValidating,
    name: input.name,
    onBlur: input.onBlur,
    onChange: input.onChange,
    onFocus: input.onFocus,
    touched: meta.touched,
    valid: meta.valid,
    value: input.value,
    warning: (meta.touched && meta.warning ? meta.warning : ''),
  })
);
