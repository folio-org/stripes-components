import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import contains from 'dom-helpers/query/contains';
import uniqueId from 'lodash/uniqueId';
import TetherComponent from 'react-tether';
import MultiDownshift from './MultiDownshift';
import SelectedValuesList from './SelectedValuesList';
import MultiSelectOptionsList from './MultiSelectOptionsList';
import SRStatus from '../SRStatus';
import DefaultOptionFormatter from '../Selection/DefaultOptionFormatter';
import TextFieldIcon from '../TextField/TextFieldIcon';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';
import ReduxFormField from '../ReduxFormField';
import css from './MultiSelect.css';

const filterOptions = (filter, list) => {
  const filterRegExp = new RegExp(`^${filter}`, 'i');
  const renderedItems = filter ? list.filter(item => item.label.search(filterRegExp) !== -1) : list;
  const exactMatch = filter ? (renderedItems.filter(item => item.label === filter).length === 1) : false;
  return { renderedItems, exactMatch };
};

class MultiSelection extends React.Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.object),
    backspaceDeletes: PropTypes.bool,
    dataOptions: PropTypes.arrayOf(PropTypes.object),
    dirty: PropTypes.bool,
    emptyMessage: PropTypes.string,
    error: PropTypes.string,
    filter: PropTypes.func,
    formatter: PropTypes.func,
    id: PropTypes.string,
    isValid: PropTypes.bool,
    itemToString: PropTypes.func,
    label: PropTypes.string,
    maxHeight: PropTypes.number,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
    placeholder: PropTypes.string,
    renderToOverlay: PropTypes.bool,
    tether: PropTypes.object,
    touched: PropTypes.bool,
    validationEnabled: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string]),
    warning: PropTypes.string,
  };

  static defaultProps = {
    actions: [],
    backspaceDeletes: true,
    dataOptions: [],
    emptyMessage: 'No matching items found!',
    filter: filterOptions,
    formatter: DefaultOptionFormatter, // default to {label:<string>, value:<string>} behavior
    itemToString: item => (item ? item.label : ''),
    maxHeight: 168,
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
          pin: true,
        },
      ],
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      renderedItems: this.props.dataOptions,
      filterValue: '', // eslint-disable-line react/no-unused-state
      exactMatch: false,
    };

    this.container = React.createRef();
    this.input = React.createRef();
    this.sr_stat = React.createRef();
    this.uiId = props.id ? props.id : uniqueId('-multiselect');
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this);

    this.setupWrapper();
  }

  setupWrapper = () => {
    if (this.props.renderToOverlay) {
      this.ControlWrapper = TetherComponent;
      this.wrapperProps = this.props.tether;
    } else {
      this.ControlWrapper = 'div';
      this.wrapperProps = { className: css.multiSelectControlWrapper };
    }
  }

  filterItems = (filter) => {
    const newState = this.props.filter(filter, this.props.dataOptions);
    this.setState(newState);
  }

  handleInputKeyDown = (event, removeItem, selectedItems, setHighlightedIndex, changeCallback) => {
    if (event.key === 'Backspace' && event.target.value.length === 0) {
      if (this.props.backspaceDeletes) {
        removeItem(selectedItems[selectedItems.length - 1], changeCallback);
        this.handleRemove(selectedItems[selectedItems.length - 1]);
      }
    }
    if (event.key === 'Home') {
      setHighlightedIndex(0);
    }
    if (event.key === 'End') {
      setHighlightedIndex(selectedItems[selectedItems.length - 1]);
    }
  }

  handleChange = selectedItems => {
    // console.log(res);
    if (this.props.onChange) {
      this.props.onChange(selectedItems);
    }
  };

  handleFocusWithin = () => {
    this.setState({ focused: true });
  }

  handleBlur = (e) => {
    if (!contains(e.target, this.container.current)) {
      this.setState({ focused: false });
    }
  }

  handleRemove = (item) => {
    const message = `${this.props.itemToString(item)} removed from selection`;
    // console.log(message);
    this.sr_stat.current.sendMessage(message);
    if (this.props.onRemove) {
      this.props.onRemove(item);
    }
  }

  getInputWidth = () => { // eslint-disable-line consistent-return
    if (this.container.current) {
      return this.container.current.offsetWidth;
    }
    return 100;
  }

  getControlClass = () => {
    return classnames(
      css.multiSelectControl,
      { [`${css.multiSelectFocused}`]: this.state.focused },
      sharedInputStylesHelper(this.props),
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
      renderToOverlay,
      actions,
      error,
      warning
    } = this.props;

    const {
      renderedItems,
      exactMatch,
    } = this.state;

    const {
      uiId,
      ControlWrapper,
      wrapperProps
    } = this;

    const valueLabelId = `multi-value-${uiId}`;
    const valueDescriptionId = `multi-describe-action-${uiId}`;
    const controlDescriptionId = `multi-describe-control-${uiId}`;
    const controlValueStatusId = `multi-value-status-${uiId}`;

    return (
      <div className={css.multiSelectContainer} ref={this.container}>
        <SRStatus ref={this.sr_stat} />
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
            removeItem,
            isOpen,
            inputValue,
            selectedItems,
            getItemProps,
            highlightedIndex,
            setHighlightedIndex,
            toggleMenu,
            changeCallback
          }) => {
            const labelProps = { ...getLabelProps() };

            const valueListProps = {
              id: `multi-values-list-${uiId}`,
              getRemoveButtonProps,
              selectedItems,
              itemToString,
              valueLabelId,
              valueDescriptionId,
              formatter,
              onRemove: this.handleRemove,
            };

            const optionListProps = {
              actions,
              exactMatch,
              id: `multiselect-option-list-${uiId}`,
              isOpen,
              getMenuProps,
              getItemProps,
              maxHeight,
              selectedItems,
              renderedItems,
              renderToOverlay,
              setHighlightedIndex,
              highlightedIndex,
              formatter,
              inputValue,
              emptyMessage,
              error,
              warning,
              width: this.getInputWidth(),
            };

            return (
              <div className={css.multiSelectContainer} role="application">
                <label // eslint-disable-line jsx-a11y/label-has-for
                  {...labelProps}
                >
                  {label}
                </label>
                <span className="sr-only" id={controlValueStatusId}>
                  {`${selectedItems.length} item${selectedItems.length !== 1 ? 's' : ''} selected`}
                </span>
                <span className="sr-only" id={controlDescriptionId}>
                Contains a list of any selected values, followed by a combobox for selecting additional values.
                </span>
                <ControlWrapper {...wrapperProps}>
                <div // eslint-disable-line
                  className={this.getControlClass()}
                  onFocus={this.handleFocusWithin}
                  onBlur={this.handleBlur}
                  tabIndex="0" // eslint-disable-line
                  aria-labelledby={`${labelProps.id} ${controlValueStatusId}`}
                  aria-describedby={controlDescriptionId}
                  onClick={() => {
                    toggleMenu();
                    if (!isOpen) {
                      this.input.current.focus();
                    }
                  }}
                >
                  <div className={css.multiSelectControlGroup}>
                    <SelectedValuesList {...valueListProps} />
                    <input
                      {...getInputProps({
                        type: 'text',
                        ref: this.input,
                        onKeyDown: (event) => {
                          this.handleInputKeyDown(
                            event,
                            removeItem,
                            selectedItems,
                            setHighlightedIndex,
                            changeCallback
                          );
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
                  <MultiSelectOptionsList {...optionListProps} />
                </ControlWrapper>
              </div>
            );
}
          }
        </MultiDownshift>
        <div role="alert">
          {error && <div className={css.multiSelectError}>{error}</div>}
          {warning && <div className={css.multiSelectError}>{warning}</div>}
        </div>
      </div>
    );
  }
}

export default ReduxFormField(MultiSelection,
  ({ input, meta }) => ({
    value: input.value,
    touched: meta.touched,
    error: meta.error,
    warning: meta.warning,
    onChange: input.onChange,
    onBlur: input.onblur,
    onFocus: input.onFocus,
  }));
