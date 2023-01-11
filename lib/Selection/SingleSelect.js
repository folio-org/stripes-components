import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Portal from 'react-overlays/Portal';
import uniqueId from 'lodash/uniqueId';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import throttle from 'lodash/throttle';
import contains from 'dom-helpers/query/contains';
import matches from 'dom-helpers/query/matches';
import { FormattedMessage } from 'react-intl';
import TextFieldIcon from '../TextField/TextFieldIcon';
import RootCloseWrapper from '../../util/RootCloseWrapper';
import Popper from '../Popper';
import SRStatus from '../SRStatus';
import Label from '../Label';
import SelectList from './SelectList';
import DefaultOptionFormatter from './DefaultOptionFormatter';
import formField from '../FormField';
import parseMeta from '../FormField/parseMeta';
import formStyles from '../sharedStyles/form.css';

import { getSelectedObject } from './utils';

import css from './Selection.css';

/* eslint-disable quote-props */
const propTypes = {
  'aria-labelledby': PropTypes.string,
  autoFocus: PropTypes.bool,
  dataOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.node,
    value: PropTypes.string,
  })).isRequired,
  dirty: PropTypes.bool,
  disabled: PropTypes.bool,
  emptyMessage: PropTypes.node,
  error: PropTypes.node,
  formatter: PropTypes.func,
  hasChanged: PropTypes.bool,
  id: PropTypes.string,
  inputRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  label: PropTypes.node,
  listMaxHeight: PropTypes.string,
  loading: PropTypes.bool,
  loadingMessage: PropTypes.node,
  marginBottom0: PropTypes.bool,
  multiple: PropTypes.bool,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFilter: PropTypes.func,
  onFocus: PropTypes.func,
  optionAlignment: PropTypes.oneOf(['start', 'end', 'outside', 'center']),
  placeholder: PropTypes.string,
  popper: PropTypes.object,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  useValidStyle: PropTypes.bool,
  valid: PropTypes.bool,
  value: PropTypes.string,
  warning: PropTypes.node,
};
/* eslint-enable quote-props */

const defaultProps = {
  formatter: DefaultOptionFormatter,
  useValidStyle: false,
  multiple: false,
  valid: false,
  inputRef: React.createRef(),
};

class SingleSelect extends React.Component {
  constructor(props) {
    super(props);

    // this._filterFocusTimeout = null;
    this._quickFilterString = '';
    this.container = React.createRef();
    this.filterTextInput = React.createRef();
    this.selectList = React.createRef();
    this.control = React.createRef();
    this.setControlRef = this.setControlRef.bind(this);
    this._srstat = React.createRef();
    this.handleChoose = this.handleChoose.bind(this);
    this.hideOnBlur = this.hideOnBlur.bind(this);
    this.filterList = this.filterList.bind(this);
    this.controlHandleKeyDown = this.controlHandleKeyDown.bind(this);
    this.filterHandleKeyDown = this.filterHandleKeyDown.bind(this);
    this.showList = this.showList.bind(this);
    this.hideList = this.hideList.bind(this);
    this.handleControlBlur = this.handleControlBlur.bind(this);
    this.handleControlClick = this.handleControlClick.bind(this);
    this.handleRootClose = this.handleRootClose.bind(this);
    this.getControlClass = this.getControlClass.bind(this);
    this.cursorNext = this.cursorNext.bind(this);
    this.cursorPrev = this.cursorPrev.bind(this);
    this.selectNext = this.selectNext.bind(this);
    this.selectPrev = this.selectPrev.bind(this);
    this.initCursor = this.initCursor.bind(this);
    this.getTextDirection = this.getTextDirection.bind(this);
    this.renderSelectedOption = this.renderSelectedOption.bind(this);
    this.toggleList = this.toggleList.bind(this);
    this.thrToggleList = throttle(this.toggleList, 300, {
      'leading': true,
      'trailing': false
    });

    const initialCursor = this.initCursor();

    this.state = {
      // cursored item info within vertical list...
      cursoredIndex: initialCursor.index,
      cursoredValue: initialCursor.value,
      cursoredLabel: initialCursor.label,

      // selected value(s) info...
      ...getSelectedObject(props.value, props.dataOptions),

      // controls display of the list...
      showList: false,

      // for filtering the list
      searchTerm: '',
      filtering: false,
      renderedList: this.props.dataOptions,

      prevDataOptions: this.props.dataOptions,
      prevValue: this.props.value,
    };

    if (this.props.id) {
      this.testId = this.props.id;
    } else {
      this.testId = uniqueId('stripes-selection-');
    }
  }

  static getDerivedStateFromProps(nextProps, state) {
    let derivedState = {};

    if (!isEqual(state.prevDataOptions, nextProps.dataOptions)) {
      const selectedIndex =
        nextProps.dataOptions.findIndex(o => o.value === (nextProps.value || state.selectedValue));

      derivedState = {
        ...derivedState,
        renderedList: nextProps.dataOptions,
        prevDataOptions: nextProps.dataOptions,
        selectedIndex,
      };
    }

    if (nextProps.value !== state.prevValue) {
      derivedState = {
        ...derivedState,
        ...getSelectedObject(nextProps.value, nextProps.dataOptions),
        prevValue: nextProps.value,
      };
    }

    return isEmpty(derivedState) ? null : derivedState;
  }

  componentWillUnmount() {
    clearTimeout(this._filterFocusTimeout);
    this._filterFocusTimeout = null;
  }

  setControlRef(elem) {
    const { inputRef } = this.props;

    if (typeof inputRef === 'function') {
      inputRef(elem);
    } else {
      inputRef.current = elem;
    }

    this.control.current = elem;
  }

  initCursor() {
    const cursorObject = { value: '', index: 0, label: '' };
    let valueIndex;
    if (this.props.dataOptions.length > 0) {
      let searchValue;
      if (this.props.value) {
        searchValue = this.props.value;
      }
      if (typeof searchValue !== 'undefined') {
        valueIndex = this.props.dataOptions.findIndex(o => o.value === searchValue);
        if (valueIndex !== -1) {
          cursorObject.value = searchValue;
          cursorObject.index = valueIndex;
          cursorObject.label = this.props.dataOptions[valueIndex].label;
        }
      } else { // value not found, we just set the cursor to the first object...
        cursorObject.index = 0;
        cursorObject.value = this.props.dataOptions[0]?.value;
        cursorObject.label = this.props.dataOptions[0]?.label;
      }
      return cursorObject;
    }
    return { value: '', index: -1, label: '' };
  }

  handleChoose(value, label, index, maintainPicker, callback) {
    // get index from full list
    let selIndex;
    if (index) {
      selIndex = index;
    } else {
      selIndex = this.props.dataOptions.findIndex(o => o.value === value && o.label === label);
    }

    // update selected in state and update cursor....
    this.setState({
      selectedValue: value,
      selectedLabel: label,
      selectedIndex: selIndex,
      cursoredIndex: selIndex,
      cursoredValue: value,
      cursoredLabel: label,
      renderedList: this.props.dataOptions,
      filtering: false,
      searchTerm: '',
    }, callback);

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  filterList(e) {
    const { dataOptions, onFilter } = this.props;
    // backspacing out filter value will reset the cursor and list.
    if (e.target.value === '') {
      this.setState(prevState => ({
        cursoredIndex: prevState.selectedIndex || 0,
        cursoredLabel: prevState.selectedLabel || dataOptions[0]?.label,
        cursoredValue: prevState.selectedValue || dataOptions[0]?.value,
        searchTerm: '',
        renderedList: this.props.dataOptions,
        filtering: false,
      }));
      return;
    }

    const presented = onFilter ?
      onFilter(e.target.value, dataOptions) :
      dataOptions.filter(o => new RegExp(`^${e.target.value}`, 'i').test(o.label));

    let ariaMessage;
    let cIndex;
    let cLabel;
    let cValue;
    if (presented.length === 0) {
      cIndex = -1;
      cLabel = '';
      cValue = '';
    } else {
      // when filtering the list, the cursor should also be updated...
      cIndex = 0;
      cLabel = presented[0].label;
      cValue = presented[0].value;
      ariaMessage = (
        <FormattedMessage
          id="stripes-components.selection.filterResultFeedback"
          values={{ length: presented.length, label: presented[0].label }}
        />
      );
    }

    this.setState({
      cursoredIndex: cIndex,
      cursoredLabel: cLabel,
      cursoredValue: cValue,
      searchTerm: e.target.value,
      renderedList: presented,
      showList: true,
      filtering: true,
    },
    () => {
      if (ariaMessage) {
        this._srstat.current.sendMessage(ariaMessage);
      }
    });
  }

  cursorNext() {
    if (this.state.renderedList.length > 0) {
      this.setState((curState) => {
        const newState = Object.assign({}, curState);
        newState.cursoredIndex += 1;
        if (newState.cursoredIndex >= curState.renderedList.length) {
          newState.cursoredIndex = 0;
        }
        newState.cursoredValue = newState.renderedList[newState.cursoredIndex].value;
        newState.cursoredLabel = newState.renderedList[newState.cursoredIndex].label;
        return newState;
      });
    }
  }

  cursorPrev() {
    if (this.state.renderedList.length > 0) {
      this.setState((curState) => {
        const newState = Object.assign({}, curState);
        newState.cursoredIndex -= 1;
        if (newState.cursoredIndex === -1) {
          newState.cursoredIndex = curState.renderedList.length - 1;
        }
        newState.cursoredValue = newState.renderedList[newState.cursoredIndex].value;
        newState.cursoredLabel = newState.renderedList[newState.cursoredIndex].label;
        return newState;
      });
    }
  }

  selectNext() {
    const current = this.state.selectedIndex;
    if (this.state.selectedIndex === this.props.dataOptions.length - 1) {
      return;
    }

    const nextInd = current + 1;
    const nextValue = this.props.dataOptions[nextInd].value;
    const nextLabel = this.props.dataOptions[nextInd].label;

    this.handleChoose(nextValue, nextLabel, nextInd);
  }

  selectPrev() {
    const current = this.state.selectedIndex;
    if (this.state.selectedIndex === 0) {
      return;
    }

    const prevInd = current - 1;
    const prevValue = this.props.dataOptions[prevInd].value;
    const prevLabel = this.props.dataOptions[prevInd].label;

    this.handleChoose(prevValue, prevLabel, prevInd);
  }

  getTextDirection() {
    const dir = getComputedStyle(document.body).direction;
    return dir;
  }

  controlHandleKeyDown(e) {
    switch (e.keyCode) {
      case 32: // space
      case 13: // enter
        e.preventDefault(); // since these keys also cause click events to trigger...
        if (this.state.showList) {
          this.handleChoose(this.state.cursoredValue, this.state.cursoredLabel, this.state.cursoredIndex);
        } else {
          this.showList();
        }
        break;
      case 9: // tab
        // trigger redux-form validation...
        // if (this.props.onBlur) {
        //   this.props.onBlur(e);
        // }
        break;
      case 40: // down
        e.preventDefault();
        if (this.state.showList) {
          if (this.state.renderedList.length > 0) {
            this.cursorNext();
          }
        } else {
          this.selectNext();
          this.showList();
          // this.showList();
          // this._filterFocusTimeout = setTimeout(() => { this.filterTextInput.focus(); }, 20);
        }
        break;
      case 38: // up
        e.preventDefault();
        if (this.state.showList) {
          if (this.state.renderedList.length > 0) {
            this.cursorPrev();
          }
        } else {
          this.selectPrev();
          this.showList();
          // this.showList();
          // this._filterFocusTimeout = setTimeout(() => { this.filterTextInput.focus(); }, 20);
        }
        break;
      default:
        this.selectOnLetterKeyDown(e);
    }
  }

  selectOnLetterKeyDown(e) {
    // handle strings from charcode to filter list
    const typedChar = String.fromCodePoint(e.keyCode);
    const lower = typedChar.toLocaleLowerCase();
    if (this._filterCharacterTimeout) {
      clearTimeout(this._filterCharacterTimeout);
      this._filterCharacterTimeout = null;
    }
    this._filterCharacterTimeout = setTimeout(() => { this._quickFilterString = ''; }, 500);
    this._quickFilterString = `${this._quickFilterString}${lower}`;
    const filtered = this.props.dataOptions.filter(o => new RegExp(`^${this._quickFilterString}`, 'i').test(o.label));
    if (filtered.length > 0) {
      if (this.state.showList) {
        this.setState((curState) => {
          const newState = Object.assign({}, curState);
          const filteredIndex = this.state.renderedList.findIndex(o => o.value === filtered[0].value);
          newState.cursoredIndex = filteredIndex;
          newState.cursoredValue = filtered[0].value;
          newState.cursoredLabel = filtered[0].label;
          return newState;
        });
      } else {
        this.handleChoose(filtered[0].value, filtered[0].label);
      }
    }
  }

  filterHandleKeyDown(e) {
    const selected = !!this.state.cursoredValue;
    switch (e.keyCode) {
      case 40: // down
        e.preventDefault();
        if (this.state.renderedList.length > 0) {
          if (this.state.filtering) {
            this.cursorNext();
          } else {
            this.selectNext();
          }
        }
        break;
      case 38: // up
        e.preventDefault();
        if (this.state.renderedList.length > 0) {
          if (this.state.filtering) {
            this.cursorPrev();
          } else {
            this.selectPrev();
          }
        }
        break;
      case 27: // escape
        e.preventDefault();
        this.hideList();
        break;
      case 32: // space
        if (!this.state.filtering || matches(e.target, 'li')) {
          if (selected) {
            this.handleChoose(this.state.cursoredValue, this.state.cursoredLabel);
            this.thrToggleList();
          }
        }
        break;
      case 13: // enter
        e.preventDefault();
        if (selected) {
          this.handleChoose(this.state.cursoredValue, this.state.cursoredLabel);
        }
        this.hideList();
        break;
      case 9: // tab
        this.setState({
          showList: false,
          filtering: false,
        });
        // if listbox's filter field is focused (single selection), refocus the main control.
        if (e.target === this.filterTextInput.current) {
          e.preventDefault();
          this.control.current.focus();
        }
        break;
      default:
        if (e.target !== this.filterTextInput.current) {
          // handle strings from charcode to filter list
          const typedChar = String.fromCodePoint(e.keyCode);
          const lower = typedChar.toLocaleLowerCase();
          const filtered = this.props.dataOptions.filter(o => new RegExp(`^[${typedChar}${lower}]`, 'i').test(o.label));
          if (filtered.length > 0) {
            this.handleChoose(filtered[0].value, filtered[0].label, null, true);
          }
        }
    }
  }

  getInputWidth() { // eslint-disable-line consistent-return
    if (this.control.current) {
      return this.control.current.offsetWidth;
    }
  }

  handleControlClick() {
    this.thrToggleList(); // throttle this function so double clicks behave fine as well.
  }

  handleControlBlur() {
    this.hideOnBlur();
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  showList(cb) {
    this.setState({
      showList: true,
      searchTerm: '',
    }, cb);
  }

  hideList() {
    this.setState({
      showList: false,
      searchTerm: '',
      filtering: false,
      renderedList: this.props.dataOptions,
    });
  }

  hideOnBlur() {
    if (!this.state.showList) {
      if (this.container && document.activeElement !== document.body) {
        if (!contains(this.selectList, document.activeElement)) {
          if (!contains(this.container, document.activeElement)) {
            this.hideList();
          }
        }
      }
    }
  }

  toggleList() {
    if (this.state.showList) {
      this.hideList();
    } else {
      this.showList();
    }
  }

  handleRootClose() {
    if (this.state.showList) {
      if (this.container.current && this.selectList.current) {
        // be sure that nothing in the select is in focus before closing the option list.
        if (!contains(this.container.current, document.activeElement) &&
          !contains(this.selectList.current, document.activeElement)) {
          // go ahead and execute redux-form validation...
          if (this.props.onBlur) {
            this.props.onBlur();
          }
          this.hideList();
        }
      }
    }
  }

  renderLabelElement = () => {
    const { label: labelProp, required, readOnly, ...rest } = this.props;
    if (!labelProp && !rest['aria-label']) {
      return null;
    }

    const label = rest['aria-label'] || labelProp;
    const labelId = `sl-label-${this.testId}`;

    return !labelProp ? (
      <div
        hidden
        id={labelId}
      >
        {label}
      </div>
    ) :
      (
        <Label
          htmlFor={this.testId}
          id={`sl-label-${this.testId}`}
          required={required}
          readOnly={readOnly}
        >
          {label}
        </Label>
      );
  }

  getControlClass() {
    let validationClasses = '';
    validationClasses = classNames(
      { [`${formStyles.hasFeedback}`]: this.props.error || this.props.warning },
      { [`${formStyles.hasWarning}`]: this.props.warning },
      { [`${formStyles.hasError}`]: this.props.error },
      { [`${formStyles.isChanged}`]: this.props.dirty },
      {
        [`${formStyles.isValid}`]:
          this.props.useValidStyle &&
          this.props.valid &&
          !this.props.error &&
          !this.props.warning
      },
    );

    return classNames(
      validationClasses,
      css.selectionControl,
      formStyles.formControl,
      { [`${css.marginBottom0}`]: this.props.marginBottom0 },
    );
  }

  getCursoredId() {
    if (this.state.renderedList.length > 0) {
      return `option-${this.testId}-${this.state.cursoredIndex}-${this.state.cursoredValue}`;
    }
    return '';
  }

  renderWarningElement = () => {
    if (this.props.warning) {
      return <div className={`${formStyles.feedbackWarning}`}>{this.props.warning}</div>;
    }
    return null;
  }

  renderErrorElement = () => {
    if (this.props.error) {
      return <div className={`${formStyles.feedbackError}`}>{this.props.error}</div>;
    }
    return null;
  }

  renderSelectedOption = () => {
    const { formatter, dataOptions } = this.props;
    const Formatter = formatter;
    const { selectedIndex, searchTerm } = this.state;
    if (selectedIndex !== -1) {
      return (<Formatter option={dataOptions[selectedIndex]} searchTerm={searchTerm} />);
    }
    return false;
  }

  renderRequiredElement = (requiredId) => {
    return this.props.required ? (<span className="sr-only" id={requiredId}>required</span>) : null;
  }

  getLabelAriaProps = (requiredId, selectedId) => {
    const { label: labelProp, ...rest } = this.props;
    const label = rest['aria-label'] || labelProp;
    const labelId = rest['aria-labelledby'] ? `${rest['aria-labelledby']} ` :
      label ? `sl-label-${this.testId} ` : '';

    return `${labelId}${selectedId}${requiredId ? ' ' + requiredId : ''}`;
  }

  render() {
    const { required, popper: popperProps } = this.props;
    const { showList: displayList } = this.state;

    // detect smaller screen size...
    const atSmallMedia = window.matchMedia('(max-width: 800px)').matches;

    let listWidth = this.getInputWidth();
    if (atSmallMedia) {
      listWidth = '80%';
    }

    const requiredId = required ? `sl-${this.testId}-required` : '';

    const selectedId = `selected-${this.testId}-item`;
    const labelledBy = this.getLabelAriaProps(requiredId, selectedId);

    const uiInput = (
      <div
        style={{ position: 'relative', width: '100%' }}
        ref={this.container}
      >
        <SRStatus ref={this._srstat} />
        {this.renderLabelElement()}
        {this.renderRequiredElement(requiredId)}
        <div className={css.selectionControlContainer}>
          <button
            type="button"
            onKeyDown={this.controlHandleKeyDown}
            onClick={this.handleControlClick}
            aria-expanded={displayList}
            aria-labelledby={labelledBy}
            aria-haspopup="listbox"
            className={this.getControlClass()}
            ref={this.setControlRef}
            id={this.testId}
            aria-disabled={(this.props.disabled)}
            aria-owns={`sl-${this.props.id}`}
            name={this.props.name}
            onFocus={this.props.onFocus}
            onBlur={this.handleControlBlur}
            autoFocus={this.props.autoFocus}
            disabled={this.props.disabled}
          >
            <span className="sr-only"><FormattedMessage id="stripes-components.selection.controlLabel" /></span>
            <div className={css.singleValue} id={selectedId}>
              {this.renderSelectedOption() || this.props.placeholder}
            </div>
          </button>
          <div className={css.selectionEndControls}>
            <TextFieldIcon icon="triangle-down" />
          </div>
        </div>
        <div role="alert">
          {this.renderWarningElement()}
          {this.renderErrorElement()}
        </div>
      </div>
    );

    const selectList = (
      <SelectList
        visible={displayList}
        cursoredValue={this.state.cursoredValue}
        activeId={this.getCursoredId()}
        id={this.testId}
        label={this.props.label}
        width={listWidth}
        maxHeight={this.props.listMaxHeight}
        list={this.state.renderedList}
        onChoose={this.handleChoose}
        filtered={this.state.filtering}
        onClose={this.hideOnBlur}
        onClickItem={this.hideList}
        selected={this.state.selectedValue}
        selectedIndex={this.state.selectedIndex}
        selectedLabel={this.state.selectedLabel}
        selectedList={[]}
        rootRef={this.selectList}
        controlRef={this.control}
        filterRef={this.filterTextInput}
        emptyMessage={this.props.emptyMessage ||
          <FormattedMessage id="stripes-components.selection.noMatches" />
        }
        loading={this.props.loading}
        loadingMessage={this.props.loadingMessage ||
          <FormattedMessage id="stripes-components.selection.loading" />
        }
        searchTerm={this.state.searchTerm}
        onFilter={this.filterList}
        onFilterKeyDown={this.filterHandleKeyDown}
        controlledBy={this.control}
        formatter={this.props.formatter}
        optionAlignment={this.props.optionAlignment}
      />
    );

    if (atSmallMedia) {
      return (
        <div ref={this.container}>
          {uiInput}
          {displayList &&
            <Portal container={document.getElementById('OverlayContainer')}>
              <div
                role="presentation"
                className={css.selectionMobileBackdrop}
                onClick={() => { this.hideList(); }}
              >
                {selectList}
              </div>
            </Portal>
          }
        </div>
      );
    }

    return (
      <>
        {uiInput}
        <Popper {...popperProps} hideIfClosed isOpen={displayList} anchorRef={this.container}>
          <RootCloseWrapper onRootClose={this.handleRootClose} ref={this.selectList}>
            {selectList}
          </RootCloseWrapper>
        </Popper>
      </>
    );
  }
}

SingleSelect.defaultProps = defaultProps;
SingleSelect.propTypes = propTypes;

export default formField(
  SingleSelect,
  ({ meta }) => ({
    dirty: meta.dirty,
    error: (meta.touched && meta.error ? meta.error : ''),
    valid: meta.valid,
    warning: (meta.touched ? parseMeta(meta, 'warning') : ''),
  })
);
