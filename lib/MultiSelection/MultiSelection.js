import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import contains from 'dom-helpers/query/contains';
import {
  noop,
  uniqueId,
  debounce,
  isEqual,
} from 'lodash';

import memoize from 'memoize-one';
import TetherComponent from 'react-tether';
import { FormattedMessage, injectIntl } from 'react-intl';
import MultiDownshift from './MultiDownshift';
import SelectedValuesList from './SelectedValuesList';
import MultiSelectFilterField from './MultiSelectFilterField';
import MultiSelectValueInput from './MultiSelectValueInput';
import MultiSelectResponsiveRenderer from './MultiSelectResponsiveRenderer';
import SRStatus from '../SRStatus';
import DefaultOptionFormatter from '../Selection/DefaultOptionFormatter';
import TextFieldIcon from '../TextField/TextFieldIcon';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';
import formField from '../FormField';
import Label from '../Label';
import parseMeta from '../FormField/parseMeta';

import css from './MultiSelect.css';
import formStyles from '../sharedStyles/form.css';

const filterOptions = (filterText, list) => {
  const filterRegExp = new RegExp(`^${filterText}`, 'i');
  const renderedItems = filterText ? list.filter(item => item.label.search(filterRegExp) !== -1) : list;
  const exactMatch = filterText ? (renderedItems.filter(item => item.label === filterText).length === 1) : false;
  return { renderedItems, exactMatch };
};

class MultiSelection extends React.Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.object),
    ariaLabelledBy: PropTypes.string,
    asyncFiltering: PropTypes.bool,
    backspaceDeletes: PropTypes.bool,
    dataOptions: PropTypes.arrayOf(PropTypes.any),
    dirty: PropTypes.bool,
    disabled: PropTypes.bool,
    emptyMessage: PropTypes.string,
    error: PropTypes.node,
    filter: PropTypes.func,
    formatter: PropTypes.func,
    id: PropTypes.string,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func
    }),
    isValid: PropTypes.bool,
    itemToString: PropTypes.func,
    label: PropTypes.node,
    maxHeight: PropTypes.number,
    modifiers: PropTypes.object,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
    placeholder: PropTypes.string,
    renderToOverlay: PropTypes.bool,
    required: PropTypes.bool,
    tether: PropTypes.object,
    validationEnabled: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string]),
    warning: PropTypes.node,
  };

  static defaultProps = {
    actions: [],
    backspaceDeletes: true,
    dataOptions: [],
    onChange: noop,
    filter: filterOptions,
    formatter: DefaultOptionFormatter, // default to {label:<string>, value:<string>} behavior
    itemToString: option => (option ? option.label : ''),
    maxHeight: 168,
    modifiers: {
      flip: { boundariesElement: 'viewport', padding: 10 },
      preventOverflow: { boundariesElement: 'viewport', padding: 10 }
    },
    tether: {
      attachment: 'top left',
      renderElementTo: null,
      targetAttachment: 'bottom left',
      optimizations: {
        gpu: false,
      },
      constraints: [{
        to: 'window',
        attachment: 'together',
      },
      ],
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      filterValue: '',
      atSmallMedia: window.matchMedia('(max-width: 800px)').matches,
      filterFocused: false,
    };

    this.container = React.createRef();
    this.control = React.createRef();
    this.input = React.createRef();
    this.selectedList = React.createRef();
    this.sr_stat = React.createRef();
    this.mdshift = React.createRef();
    this.uiId = props.id ? props.id : uniqueId('multiselect-');
    this.dbResize = debounce(this.handleResize, { leading: false, trailing: true });
    this.dbFilter = debounce(this.props.filter, 300, { leading: false, trailing: true });
    this.setupWrapper();

    this.emptyMessage = props.emptyMessage ||
      <FormattedMessage id="stripes-components.multiSelection.defaultEmptyMessage" />;

    this.useLegacy = !isEqual(props.tether, MultiSelection.defaultProps.tether);
    if (this.useLegacy) {
      console.warn('MultiSelection: tether prop will be removed in future releases. Use "modifiers" prop instead.');
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.dbResize);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.atSmallMedia !== this.state.atSmallMedia && this.state.filterFocused) {
      if (this.input.current) {
        this.input.current.focus();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.dbResize);
  }

  getContainerWidth = () => { // eslint-disable-line consistent-return
    if (this.container.current) {
      return this.container.current.offsetWidth;
    }
    return 100;
  };

  setupWrapper = () => {
    const { renderToOverlay, tether } = this.props;
    if (renderToOverlay && this.useLegacy) {
      this.ControlWrapper = TetherComponent;
      this.wrapperProps = tether;
    } else {
      this.ControlWrapper = 'div';
      this.wrapperProps = { className: css.multiSelectControlWrapper };
    }
  };

  applyFilter = memoize(this.props.filter);

  handleFilter = (filterValue) => {
    this.setState({ filterValue });
    if (this.props.asyncFiltering && filterValue !== '') {
      this.props.filter(filterValue);
    }
  };

  handleResize = () => {
    if (window.matchMedia('(max-width: 800px)').matches) {
      if (!this.state.atSmallMedia) {
        this.setState({ atSmallMedia: true });
      }
    } else if (this.state.atSmallMedia) {
      this.setState({ atSmallMedia: false });
    }
  };

  handleChange = (selectedItems, stateAndHelpers) => {
    if (this.props.disabled) {
      return;
    }

    this.props.onChange(selectedItems);

    if (Object.prototype.hasOwnProperty.call(stateAndHelpers, 'removeButtonIndex')) {
      if (this.selectedList.current) {
        this.selectedList.current.handleFocusAfterRemoval(stateAndHelpers.removeButtonIndex, selectedItems.length);
      }
    }
  };

  handleFocusWithin = () => {
    this.setState({ focused: true });
  };

  handleFilterFocus = () => {
    this.setState({ filterFocused: true });
  };

  handleFilterBlur = (e) => {
    this.setState({ filterFocused: false });
    if (this.mdshift.current && this.props.onBlur) {
      this.props.onBlur(e, this.mdshift.current.getSelectedItems());
    }
  };

  handleBlur = (e) => {
    if (!contains(e.target, this.container.current)) {
      this.setState({ focused: false });
    }
  };

  onRemove = (item) => {
    const message = `${this.props.itemToString(item)} removed from selection`;
    // console.log(message);
    this.sr_stat.current.sendMessage(message);
    if (this.props.onRemove) {
      this.props.onRemove(item);
    }
  };

  getControlClass = () => {
    return classnames(
      css.multiSelectControl,
      {
        [`${css.multiSelectFocused}`]: this.state.focused,
        [`${formStyles.isDisabled}`]: this.props.disabled,
      },
      sharedInputStylesHelper(this.props),
    );
  };

  getPlaceholder = (selectedItems, atSmallMedia, placeholder) => {
    if (selectedItems.length === 0) {
      return placeholder;
    } else if (atSmallMedia) {
      return <FormattedMessage id="stripes-components.multiSelection.filterPlaceholder" />;
    } else {
      return '';
    }
  };

  renderInputOrPlaceholder = (filterProps) => {
    if (!this.state.atSmallMedia) {
      return <MultiSelectFilterField {...filterProps} />;
    } else {
      return (<div>{this.props.placeholder}</div>);
    }
  };

  renderValueInput = (inputProps) => {
    return (
      <MultiSelectValueInput
        {...inputProps}
        onFocus={this.onValueInputFocus}
      />);
  };

  /**
   * Moves focus to the filter input on desktop and the control element on mobile
   * when the hidden value input is focused.
   * This will typically happen when the required prop is set to true
   * and the HTML5 validation kicks in on form submit.
   */
  onValueInputFocus = () => {
    const { intl } = this.props;
    const { atSmallMedia } = this.state;

    if (atSmallMedia && this.control && this.control.current) {
      this.control.current.focus();
    } else if (!atSmallMedia && this.input && this.input.current) {
      this.input.current.focus();
    }

    this.sr_stat.current.sendMessage(intl.formatMessage({ id: 'stripes-components.requiredFieldMessage' }));
  }

  handleDownshiftStateChange = (changes) => {
    if (this.props.asyncFiltering) {
      if (Object.prototype.hasOwnProperty.call(changes, 'isOpen') &&
        !Object.prototype.hasOwnProperty.call(changes, 'inputValue') &&
        changes.isOpen) {
        this.dbFilter(this.state.filterValue);
      }
    }
  };

  getActionHelpers = (filterResults) => {
    return { ...this.state, ...filterResults };
  };

  render() {
    const {
      ariaLabelledBy: ariaLabelledByProp,
      asyncFiltering,
      backspaceDeletes,
      itemToString,
      value,
      formatter,
      label,
      placeholder,
      maxHeight,
      renderToOverlay,
      actions,
      error,
      warning,
      required,
      disabled,
      modifiers,
      ...rest
    } = this.props;

    const {
      atSmallMedia,
    } = this.state;

    const {
      ControlWrapper,
      onRemove,
      uiId,
      wrapperProps,
      emptyMessage,
      useLegacy,
    } = this;

    const ariaLabelledBy = rest['aria-labelledby'] || ariaLabelledByProp;
    const valueLabelId = `multi-value-${uiId}`;
    const valueDescriptionId = `multi-describe-action-${uiId}`;
    const controlDescriptionId = `multi-describe-control-${uiId}`;
    const controlValueStatusId = `multi-value-status-${uiId}`;

    let filterResults;
    if (!asyncFiltering) {
      filterResults = this.applyFilter(this.state.filterValue, this.props.dataOptions);
    } else {
      filterResults = { renderedItems: this.props.dataOptions };
    }

    return (
      <div className={css.multiSelectContainer} ref={this.container} id={uiId}>
        <SRStatus ref={this.sr_stat} />
        <MultiDownshift
          asyncFiltering={asyncFiltering}
          onChange={this.handleChange}
          onStateChange={this.handleDownshiftStateChange}
          onInputValueChange={this.handleFilter}
          itemToString={itemToString}
          actionHelpers={() => this.getActionHelpers(filterResults)}
          value={value && value !== '' ? value : []}
          id={`${uiId}-main`}
          labelId={ariaLabelledBy || `${uiId}-label`}
          inputId={`${uiId}-input`}
          menuId={`multiselect-option-list-${uiId}`}
          ref={this.mdshift}
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
            reset,
            toggleMenu,
            internalChangeCallback
          }) => {
            const labelProps = { ...getLabelProps({ required }) };

            const renderedPlaceholder = this.getPlaceholder(selectedItems || [], atSmallMedia, placeholder);

            const valueListProps = {
              id: `multi-values-list-${uiId}`,
              atSmallMedia,
              inputRef: this.input,
              getRemoveButtonProps,
              selectedItems,
              itemToString,
              valueLabelId,
              valueDescriptionId,
              formatter,
              onRemove,
              ref: this.selectedList,
            };

            const filterProps = {
              ariaLabelledBy,
              atSmallMedia,
              backspaceDeletes,
              getInputProps,
              inputRef: this.input,
              internalChangeCallback,
              onBlur: this.handleFilterBlur,
              onFocus: this.handleFilterFocus,
              onRemove,
              optionsLength: filterResults.renderedItems ? filterResults.renderedItems.length : 0,
              modifiers,
              placeholder: renderedPlaceholder,
              selectedItems,
              setHighlightedIndex,
              removeItem,
              required,
              disabled,
            };

            const inputProps = {
              ariaLabelledBy: `${uiId}-label`,
              id: `multiselect-input-${uiId}`,
              required,
              getInputProps,
              value: Array.isArray(value) ? value.map(this.props.itemToString).join(',') : value,
            };

            const optionListProps = {
              actions,
              ariaLabelledBy,
              asyncFiltering,
              containerWidth: this.getContainerWidth(),
              internalChangeCallback,
              controlRef: this.control,
              id: `multiselect-option-list-${uiId}`,
              inputRef: this.input,
              isOpen,
              getMenuProps,
              getItemProps,
              maxHeight,
              itemToString,
              placeholder: renderedPlaceholder,
              inputKeyDown: this.handleInputKeyDown,
              selectedItems,
              renderToOverlay,
              removeItem,
              setHighlightedIndex,
              highlightedIndex,
              getInputProps,
              formatter,
              inputValue,
              emptyMessage,
              error,
              warning,
              atSmallMedia,
              downshiftActions: { reset },
              useLegacy,
              ...filterResults,
            };

            const handleControlClick = () => {
              if (disabled) {
                return;
              }

              toggleMenu();
              if (!isOpen && this.input.current) {
                this.input.current.focus();
              }
            };

            return (
              <div className={css.multiSelectContainer} role="application">
                {/* linting disabled for the label assigning has-for and otherwise associating the label
                    with the control... labelProps/downshift handles this...
                */}
                {label &&
                  <Label // eslint-disable-line
                    {...labelProps}
                  >
                    {label}
                  </Label>
                }
                <span className="sr-only" id={controlValueStatusId}>
                  {`${
                    selectedItems ? selectedItems.length : 0
                  } item${
                    !selectedItems || selectedItems.length !== 1 ? 's' : ''
                  } selected`
                  }
                </span>
                <span className="sr-only" id={controlDescriptionId}>
                  <FormattedMessage id="stripes-components.multiSelection.controlDescription" />
                </span>
                <ControlWrapper {...wrapperProps}>
                  <div // eslint-disable-line
                    className={this.getControlClass()}
                    onFocus={this.handleFocusWithin}
                    onBlur={this.handleBlur}
                    tabIndex="0" // eslint-disable-line
                    ref={this.control}
                    aria-labelledby={`${label ? labelProps.id + ' ' : ''}${ariaLabelledBy ? ariaLabelledBy + ' ' : ''}${controlValueStatusId}`} // eslint-disable-line
                    aria-describedby={controlDescriptionId}
                    onClick={handleControlClick}
                  >
                    <div className={css.multiSelectControlGroup}>
                      <SelectedValuesList {...valueListProps} />
                      {this.renderInputOrPlaceholder(filterProps)}
                      {this.renderValueInput(inputProps)}
                    </div>
                    <button
                      className={css.multiSelectToggleButton}
                      type="button"
                      {...getToggleButtonProps({
                        // prevents the menu from immediately toggling
                        // closed (due to our custom click handler above).
                        disabled,
                        onClick(event) {
                          event.stopPropagation();
                        }
                      })}
                    >
                      <TextFieldIcon icon="triangle-down" />
                    </button>
                  </div>
                  <MultiSelectResponsiveRenderer {...optionListProps} />
                </ControlWrapper>
              </div>
            );
          }
          }
        </MultiDownshift>
        <div role="alert">
          {error && <div className={css.multiSelectError}>{error}</div>}
          {warning && <div className={css.multiSelectWarning}>{warning}</div>}
        </div>
      </div>
    );
  }
}

export default formField(
  injectIntl(MultiSelection),
  ({ meta }) => ({
    error: (meta.touched && meta.error ? meta.error : ''),
    warning: (meta.touched ? parseMeta(meta, 'warning') : ''),
  })
);
