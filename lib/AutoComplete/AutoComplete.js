import React from 'react';
import Downshift from 'downshift';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';
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



  render() {

  const { tether,
    suggestions,
    label,
    required,
    input,
    meta, validationEnabled, value } = this.props;
    console.log(meta.touched, 'meta');

    const inputProps = {
      autoComplete: 'off',
      required,
      label,
      validationEnabled,
      value,
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
                    <TextField ref={this.textfield} {...getInputProps(inputProps)} meta={meta} input={input} />
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

export default AutoComplete;
