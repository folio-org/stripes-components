import React from 'react';
import Downshift from 'downshift';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import TetherComponent from 'react-tether';
import injectIntl from '../InjectIntl';
import TextField from '../TextField';
import reduxFormField from '../ReduxFormField';
import css from './AutoComplete.css';

const defaultProps = {
  validationEnabled: true,
  tether: {
    attachment: 'top center',
    renderElementTo: null,
    targetAttachment: 'bottom center',
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

class AutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.textfield = React.createRef();
    this.testId = this.props.id || uniqueId('detailname-');
    this.autoCompleteId = `list-dropdown-${this.testId}`;
  }

  // To override onOuterClicks default behavior of reseting the input value
  onOuterClick(e) {
    this.props.onChange(e.inputValue);
  }

  render() {
    const { tether,
      items,
      label,
      value,
      required,
      validationEnabled, onBlur, error, onChange } = this.props;

    const textfieldRef = this.textfield;
    const mergedTetherProps = Object.assign({}, AutoComplete.defaultProps.tether, tether);
    const testId = this.testId;
    const autoCompleteId = this.autoCompleteId;
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
      <TetherComponent {...mergedTetherProps}>
        <Downshift
          style={{ display: 'inline-block', position: 'relative' }}
          itemToString={item => (item ? item.value : '')}
          onInputValueChange={onChange}
          onOuterClick={this.onOuterClick}
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
                <div
                  className={css.TextFieldDiv}
                  aria-live="assertive"
                  aria-relevant="additions"
                >
                  <TextField {...getInputProps(
                      { ...inputProps,
                        onBlur: (e) => {
                            e.preventDefault();
                            onBlur(e);
                      } }
                    )}
                  />
                </div>
                <ul className={css.AutoComplete} {...getMenuProps({ id: autoCompleteId })} >
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
              </div>
              )
            }
        </Downshift>
      </TetherComponent>
    );
  }
}

AutoComplete.propTypes = propTypes;
AutoComplete.defaultProps = defaultProps;

export default reduxFormField(
  injectIntl(
    AutoComplete, { withRef: true }
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
