import React from 'react';
import Downshift from 'downshift';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';
import TextField from '../TextField';

const defaultProps = {
  tether: {
    attachment: 'top center',
    renderElementTo: null,
    targetAttachment: 'bottom center',
    optimizations: {
      gpu: false,
    },
    constraints: [{
      to: 'window',
      attachment: 'together',
    },
    {
      to: 'scrollParent',
      pin: true,
    },
    ],
  },
};

const propTypes = {
  label: PropTypes.string,
  screenReaderMessage: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.object),
  tether: PropTypes.object,
};

class AutoComplete extends React.Component {
  render() {
    const { tether,
      suggestions,
      label } = this.props;

    const inputProps = {
      autoComplete: 'off',
    };

    const mergedTetherProps = Object.assign({}, AutoComplete.defaultProps.tether, tether);

    return (
      <TetherComponent {...mergedTetherProps}>
        <div style={{ position: 'relative', width: '100%' }} ref={(ref) => { this.container = ref; }}>
          <div
            aria-live="assertive"
            aria-relevant="additions"
          />
        </div>
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
                <label {...getLabelProps()}>{label}</label> {/* eslint-disable-line jsx-a11y/label-has-for */}
                <TextField ref={this.textfield} {...getInputProps(inputProps)} />
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
