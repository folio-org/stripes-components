import React from 'react';
import Downshift from 'downshift';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';
import TextField from '../TextField';
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
  defaultValue: PropTypes.string,
  id: PropTypes.string,
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.object,
  required: PropTypes.bool,
  screenReaderMessage: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.object).isRequired,
  tether: PropTypes.object,
  validationEnabled: PropTypes.bool,
};

class AutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.textfield = React.createRef();
  }

  render() {
    const { tether,
      suggestions,
      label,
      required,
      input,
      meta, validationEnabled, id, defaultValue } = this.props;

    const value = defaultValue || input ? input.value : '';
    const textfieldRef = this.textfield;
    const inputProps = {
      autoComplete: 'off',
      required,
      label,
      validationEnabled,
      meta,
      input,
      ref: textfieldRef,
      id,
    };
    const mergedTetherProps = Object.assign({}, AutoComplete.defaultProps.tether, tether);
    this.testId = id ? `${id}-list` : '';

    return (
      <TetherComponent {...mergedTetherProps}>
        <Downshift
          style={{ display: 'inline-block', position: 'relative' }}
          itemToString={item => (item ? item.value : '')}
          defaultInputValue={value}
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
              <div >
                <div style={{ position: 'relative', width: '100%' }}>
                  <div
                    aria-live="assertive"
                    aria-relevant="additions"
                  >
                    <TextField {...getInputProps(
                        { ...inputProps,
                          value: inputValue,
                          onBlur: (e) => {
                              e.preventDefault();
                              input.onBlur(e);
                        } }
                      )}
                    />
                  </div>
                  <ul className={css.AutoComplete} {...getMenuProps({ id: this.testId })} >
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

export default AutoComplete;
