import React from 'react';
import Downshift from 'downshift';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';
import reduxFormField from '../ReduxFormField';
import injectIntl from '../InjectIntl';
import TextField from '../TextField';

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
  label: PropTypes.string,
  screenReaderMessage: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.object),
  tether: PropTypes.object,
  required: PropTypes.bool,
};

class AutoComplete extends React.Component {

  constructor(props){
    super(props);
    this.textfield = React.createRef();
  }

  render() {

    const { tether,
      suggestions,
      label,
      required,
      input,
      meta, validationEnabled, value } = this.props;

    const textfieldRef = this.textfield;

    const inputProps = {
      autoComplete: 'off',
      required,
      label,
      validationEnabled,
      value,
      meta,
      input,
      ref: textfieldRef,
      name,
    };

    const mergedTetherProps = Object.assign({}, AutoComplete.defaultProps.tether, tether);

    return (
      <TetherComponent {...mergedTetherProps}>
        <Downshift
          style={{ display: 'inline-block', position: 'relative' }}
          itemToString={item => (item ? item.value : '')}
        >
          {({
              getInputProps,
              getItemProps,
              getMenuProps,
              getLabelProps,
              selectedItem,
              highlightedIndex,
              isOpen,
              inputValue,
            }) => (
              <div>
                <div style={{ position: 'relative', width: '100%' }}>
                  <div
                    aria-live="assertive"
                    aria-relevant="additions"
                  >
                    <TextField {...getInputProps(inputProps)} />
                  </div>
                <ul style={{ listStyleType: 'none' }} {...getMenuProps()}>
                  {isOpen
                      ? suggestions
                        .filter(item => !inputValue || item.value.includes(inputValue))
                        .map((item, index) => (
                          <li
                            {...getItemProps({
                              key: item.value,
                              index,
                              item,
                              style: {
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

//export default AutoComplete;

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
