import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import contains from 'dom-helpers/query/contains';
import MultiDownshift from './MultiDownshift';
import { SelectOption } from './SelectOption';
import TextFieldIcon from '../TextField/TextFieldIcon';
import findIndex from 'lodash/findIndex';
import uniqueId from 'lodash/uniqueId';
// import IconButton from '../IconButton';
import ValueChip from './ValueChip';
import ReduxFormField from '../ReduxFormField';
import css from './MultiSelect.css';

const filterOptions = (filter, list) => {
  const filterRegExp = new RegExp(`^${filter}`, 'i');
  const renderedItems = filter ? list.filter(item => item.label.search(filterRegExp) !== -1) : list;
  const exactMatch = filter ? (renderedItems.filter(item => item.label === filter).length === 1) : false;
  return { renderedItems, exactMatch };
};

class MultiSelect extends React.Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.object),
    dataOptions: PropTypes.arrayOf(PropTypes.object),
    dirty: PropTypes.bool,
    emptyMessage: PropTypes.string,
    error: PropTypes.string,
    filter: PropTypes.func,
    formatter: PropTypes.func,
    id: PropTypes.string,
    itemToString: PropTypes.func,
    label: PropTypes.string,
    maxHeight: PropTypes.number,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    touched: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string]
    ),
    warning: PropTypes.string,
  };

  static defaultProps = {
    actions: [],
    dataOptions: [],
    emptyMessage: 'No matching items found!',
    filter: filterOptions,
    formatter: item => (item ? item.label : null), // default to {label:<string>, value:<string>} behavior
    itemToString: item => item.label,
    maxHeight: 168,
  };

  constructor(props) {
    super(props);

    this.state = {
      renderedItems: this.props.dataOptions,
      filterValue: '', // eslint-disable-line react/no-unused-state
      exactMatch: false,
    }
  
    this.container = React.createRef();
    this.input = React.createRef();
    this.selectedList = React.createRef();

    this.uiId = props.id ? props.id : uniqueId('-multiselect');
  }
  
  filterItems = (filter) => {
    const newState = this.props.filter(filter, this.props.dataOptions);
    this.setState(newState);
  }

  handleKeyDown = e => {
    switch (e.keyCode) {
      case 35: // end
        this.selectedList.current.querySelector('li:last-child button').focus();
        break;
      case 36: // home
        this.selectedList.current
          .querySelector('li:first-child button')
          .focus();
        break;
      default:
    }
  };

  focusAfterRemoval = index => {
    if (
      this.selectedList.current &&
      this.selectedList.current.childNodes.length >= index
    ) {
      const select = index === 0 ? 1 : index;
      this.selectedList.current
        .querySelector(`li:nth-child(${select}n) button`)
        .focus();
    } else {
      this.input.current.focus();
    }
  };

  handleChange = selectedItems => {
    const res = selectedItems.map(si => si.value);
    // console.log(res);
    if (this.props.onChange) {
      this.props.onChange(res);
    }
  };

  handleFocusWithin = (e) => {
    this.setState({focused: true});
  }

  handleBlur = (e) => {
    if(!contains(e.target, this.container.current)) {
      this.setState({ focused: false });
    }
  }

  getControlClass = () => {
    return classnames(
      css.multiSelectControl,
      { [`${css.focused}`] : this.state.focused }
    );
  }

  render() {
    const {
      emptyMessage,
      itemToString,
      value,
      formatter,
      label,
      placeholder,
      maxHeight,
      actions,
    } = this.props;

    const {
      renderedItems,
      exactMatch,
    } = this.state;

    const {
      uiId
    } = this;

    const valueLabelId = `multi_value_${uiId}`;
    const valueDescriptionId = `multi_describe_action_${uiId}`;
    const controlDescriptionId = `multi_describe_control_${uiId}`;
    const controlValueStatusId = `multi_value_status_${uiId}`;

    return (
      <div className="multiSelectContainer" ref={this.container}>
        <MultiDownshift
          onChange={this.handleChange}
          onInputValueChange={this.filterItems}
          itemToString={itemToString}
          actionHelpers={() => this.state}
          value={value}
        >
          {({
            getInputProps,
            getToggleButtonProps,
            getMenuProps,
            getLabelProps,
            getRemoveButtonProps,
            getRootProps,
            removeItem,
            isOpen,
            inputValue,
            selectedItems,
            getItemProps,
            highlightedIndex,
            toggleMenu
          }) => (
            <div className={css.multiSelectContainer} role="application">
              <label // eslint-disable-line jsx-a11y/label-has-for
                {...getLabelProps()}
              >
                {label}
              </label> 
              <span className="sr-only" id={controlValueStatusId}>
                  {`${selectedItems.length} item${selectedItems.length !== 1 ? 's' : ''} selected`}
              </span>
              <span className="sr-only" id={valueLabelId}>
                remove value
              </span>
              <span className="sr-only" id={valueDescriptionId}>
                Press enter or spacebar to remove item from selection list. Home and end keys navigate to the first or last items.
              </span>
              <span className="sr-only" id={controlDescriptionId}>
                Contains a list of any selected values, followed by a combobox for selecting additional values.
              </span>
              <div // eslint-disable-line
                className={this.getControlClass()}
                onFocus={this.handleFocusWithin}
                onBlur={this.handleBlur}
                tabIndex="0"
                aria-labelledby={`${controlValueStatusId}`}
                aria-describedby={controlDescriptionId}
                onClick={() => {
                  toggleMenu();
                  if (!isOpen) {
                    this.input.current.focus();
                  }
                }}
              >
                <div className={css.multiSelectControlGroup}>
                  {selectedItems.length > 0 ? (
                    <ul
                      className={css.multiSelectValueList}
                      ref={this.selectedList}
                    >
                      {selectedItems.map((item, index) => (
                        <ValueChip
                          key={`${itemToString(item)}-${index}`}
                          id={`${itemToString(item)}-${index}`}
                          controlLabelId={valueLabelId}
                          descriptionId={valueDescriptionId}
                          removeButtonProps={
                            getRemoveButtonProps({
                            item,
                            onKeyDown: this.handleKeyDown,
                            afterRemoval: () => {
                              this.focusAfterRemoval(index);
                            }
                          })}
                        >
                          {formatter(item)}
                        </ValueChip>
                        ))}
                    </ul>
                    ) : null}
                      <input
                        {...getInputProps({
                          type: 'text',
                          ref: this.input,
                          onKeyUp(event) {
                            if (event.key === 'Backspace' && !inputValue) {
                              removeItem(selectedItems[selectedItems.length - 1]);
                            }
                          },
                          placeholder: selectedItems.length === 0 ? placeholder : '',
                          className: css.multiSelectInput,
                        })}
                      />
                </div>
                <button
                  className={css.multiSelectToggleButton}
                  {...getToggleButtonProps({
                    // prevents the menu from immediately toggling
                    // closed (due to our custom click handler above).
                    onClick(event) {
                      event.stopPropagation();
                    }
                  })}
                >
                  <TextFieldIcon icon="down-triangle" />
                </button>
              </div>
              {isOpen && (
                <div className={css.multiSelectMenu} {...getMenuProps()}>
                  <div role="alert">
                    {this.state.renderedItems.length === 0 &&
                      <strong>{emptyMessage}</strong>
                    }
                  </div>
                  <ul style={{maxHeight: `${maxHeight}px`}} className={css.multiSelectOptionList}>
                    {renderedItems.length > 0 &&
                      renderedItems.map((item, index) => (
                        <SelectOption
                          key={`${item.label}`}
                          {...getItemProps({
                            item,
                            index,
                            optionItem: item,
                            isActive: highlightedIndex === index,
                            isSelected: findIndex(selectedItems, item) !== -1,
                          })}
                        >
                          {formatter(item)}
                        </SelectOption>
                      ))}
                    {actions.length > 0 && actions.map((item, index) =>
                      <SelectOption
                        key={`${this.props.id}-action-${renderedItems.length + index}`}
                        {...getItemProps({
                          item,
                          index: renderedItems.length + index,
                          optionItem: item,
                          isActive: highlightedIndex === renderedItems.length + index,
                        })}
                      >
                        {
                          item.render({
                            inputValue,
                            exactMatch,
                            renderedItems,
                          })
                        }
                      </SelectOption>)
                    }
                  </ul>

                </div>
              )}
            </div>
            )}
        </MultiDownshift>
      </div>
    );
  }
}

export default ReduxFormField(MultiSelect,
  ({ input, meta }) => ({
    value: input.value,
    touched: meta.touched,
    error: meta.error,
    warning: meta.warning,
    onChange: input.onChange,
    onBlur: input.onblur,
    onFocus: input.onFocus,
  }));
