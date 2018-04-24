import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TetherComponent from 'react-tether';
import Portal from 'react-overlays/lib/Portal';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import uniqueId from 'lodash/uniqueId';
import contains from 'dom-helpers/query/contains';
import TextFieldIcon from '../TextField/TextFieldIcon';
import SelectList from './SelectList';
import DefaultOptionFormatter from './DefaultOptionFormatter';
import SRStatus from '../SRStatus';
import css from './Selection.css';

const propTypes = {
  emptyMessage: PropTypes.string,
  listMaxHeight: PropTypes.string,
  tether: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string,
  input: PropTypes.object,
  meta: PropTypes.object,
  dataOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  useValidStyle: PropTypes.bool,
  id: PropTypes.string,
  rounded: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  placeholder: PropTypes.string,
  onFocus: PropTypes.func,
  onFilter: PropTypes.func,
  formatter: PropTypes.func,
  optionAlignment: PropTypes.oneOf(['start', 'end', 'outside', 'center']),
  autoFocus: PropTypes.bool,
};

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
  emptyMessage: 'No matching options',
  useValidStyle: false,
  formatter: DefaultOptionFormatter,
};

class SingleSelect extends React.Component {
  constructor(props) {
    super(props);

    this._filterFocusTimeout = null;
    this._quickFilterString = '';
    this.container = null;
    this.filterTextInput = null;
    this.selectList = null;
    this.picker = null;
    this.control = null;

    this.handleChoose = this.handleChoose.bind(this);
    this.filterList = this.filterList.bind(this);
    this.controlHandleKeyDown = this.controlHandleKeyDown.bind(this);
    this.filterHandleKeyDown = this.filterHandleKeyDown.bind(this);
    this.showList = this.showList.bind(this);
    this.hideList = this.hideList.bind(this);
    this.hideOnBlur = this.hideOnBlur.bind(this);
    this.handleFieldMouseDown = this.handleFieldMouseDown.bind(this);
    this.handleRootClose = this.handleRootClose.bind(this);
    this.getControlClass = this.getControlClass.bind(this);
    this.cursorNext = this.cursorNext.bind(this);
    this.cursorPrev = this.cursorPrev.bind(this);
    this.initCursor = this.initCursor.bind(this);
    this.initValue = this.initValue.bind(this);
    this.getTextDirection = this.getTextDirection.bind(this);
    this.getWarningElement = this.getWarningElement.bind(this);
    this.getErrorElement = this.getErrorElement.bind(this);
    this.renderSelectedOption = this.renderSelectedOption.bind(this);

    const initialCursor = this.initCursor();
    const initialValue = this.initValue();

    this.state = {
      // cursored item info within vertical list...
      cursoredIndex: initialCursor.index,
      cursoredValue: initialCursor.value,
      cursoredLabel: initialCursor.label,

      // selected value(s) info...
      selectedIndex: initialValue.index,
      selectedValue: initialValue.value,
      selectedLabel: initialValue.label,

      // controls display of the list...
      showList: false,

      // for filtering the list
      searchTerm: '',
      filtering: false,
      renderedList: this.props.dataOptions,
    };

    if (this.props.id) {
      this.testId = this.props.id;
    } else {
      this.testId = uniqueId('stripes-selection-');
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.input && nextProps.input.value !== this.props.input.value) {
      const newValue = this.initValue(nextProps.input.value);
      this.setState(curState => (
        Object.assign({}, curState, {
          selectedIndex: newValue.index,
          selectedValue: newValue.value,
          selectedLabel: newValue.label,
        })
      ));
    }

    // if the select list is being shown and an item is selected, sync the cursor...
    if (this.state.selectedIndex !== -1) {
      if (!this.state.showList && nextState.showList) {
        this.setState((curState) => {
          const newState = Object.assign({}, curState);
          newState.cursoredIndex = curState.selectedIndex;
          newState.cursoredValue = curState.selectedValue;
          newState.cursoredLabel = curState.selectedLabel;
          return newState;
        });
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this._filterFocusTimeout);
    this._filterFocusTimeout = null;
  }

  initCursor() {
    const cursorObject = { value: '', index: 0, label: '' };
    let valueIndex;
    if (this.props.dataOptions.length > 0) {
      let searchValue;
      if (this.props.input) {
        if (Array.isArray(this.props.input.value)) {
          if (this.props.input.value.length > 0) {
            searchValue = this.props.input.value[0];
          } else {
            cursorObject.index = 0;
            cursorObject.value = this.props.dataOptions[0].value;
            cursorObject.label = this.props.dataOptions[0].label;
            return cursorObject;
          }
        } else {
          searchValue = this.props.input.value;
        }
        if (searchValue === '') { // in the case of RF, nothing selected, so cursor the 1st...
          cursorObject.index = 0;
          cursorObject.value = this.props.dataOptions[0].value;
          cursorObject.label = this.props.dataOptions[0].label;
          return cursorObject;
        }
      } else if (this.props.value) {
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
        cursorObject.value = this.props.dataOptions[0].value;
        cursorObject.label = this.props.dataOptions[0].label;
      }
      return cursorObject;
    }
    return { value: '', index: -1, label: '' };
  }

  initValue(value) {
    let _value;
    if (!value) {
      if (this.props.input.value) {
        if (Array.isArray(this.props.input.value)) {
          _value = this.props.input.value[0];
        } else {
          _value = this.props.input.value;
        }
      } else {
        _value = this.props.value;
      }
    } else {
      _value = value;
    }
    const selectedObject = { value: undefined, index: -1, label: undefined };
    let valueIndex;
    if (this.props.dataOptions.length > 0) {
      if (typeof _value !== 'undefined') { // in the case of RF, nothing selected, so cursor the 1st...
        valueIndex = this.props.dataOptions.findIndex(o => o.value === _value);
        if (valueIndex !== -1) {
          selectedObject.value = _value;
          selectedObject.index = valueIndex;
          selectedObject.label = this.props.dataOptions[valueIndex].label;
        }
      }
    }
    return selectedObject;
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
    }, callback);

    if (!maintainPicker) {
      this.hideList();
    }

    /*  refocus the control prior to calling the onChange handler -
    the new value doesn't seem to stick if the change happens first. */
    this.control.focus();

    if (this.props.input) {
      this.props.input.onChange(value);
      if (this.props.onChange) {
        this.props.onChange(null, value);
      }
    } else if (this.props.onChange) {
      this.props.onChange(null, value);
    }

    // inform screen reader of selection...
    this._srstat.sendMessage(`${label} selected`);
  }

  filterList(e) {
    const { onFilter, dataOptions } = this.props;
    const presented = onFilter ?
      onFilter(e.target.value, dataOptions) :
      dataOptions.filter(o => new RegExp(`^${e.target.value}`, 'i').test(o.label));

    // update context for screen-reader user
    let ariaMessage;
    let cIndex;
    let cLabel;
    let cValue;
    if (presented.length === 0) {
      cIndex = -1;
      cLabel = '';
      cValue = '';
      ariaMessage = this.props.emptyMessage;
    } else {
      // when filtering the list, the cursor should also be updated...
      cIndex = 0;
      cLabel = presented[0].label;
      cValue = presented[0].value;
      ariaMessage = `${presented.length} items found, ${presented[0].label} selected`;
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
      this._srstat.sendMessage(ariaMessage);
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

  getTextDirection() { // eslint-disable-line
    const dir = getComputedStyle(document.body).direction;
    return dir;
  }

  controlHandleKeyDown(e) {
    // let nextItemIndex;
    // let nextItem;
    switch (e.keyCode) {
      case 13: // enter
        e.preventDefault();
        if (this.state.showList) {
          this.handleChoose(this.state.cursoredValue, this.state.cursoredLabel, this.state.cursoredIndex);
        } else {
          this.showList();
          // focus filter when dropdown opened via keypress...
          this._filterFocusTimeout = setTimeout(() => { this.filterTextInput.focus(); }, 20);
        }
        break;
      case 9: // tab
        // trigger redux-form validation...
        if (this.props.input && this.props.meta) {
          this.props.input.onBlur();
        }
        break;
      case 40: // down
        e.preventDefault();
        if (this.state.showList) {
          if (this.state.renderedList.length > 0) {
            this.cursorNext();
          }
        } else {
          // immediate selection of item on down-arrow keypress...commenting out for now.
          // if (this.state.selectedIndex === this.props.dataOptions.length - 1) {
          //   nextItemIndex = 0;
          // } else {
          //   nextItemIndex = this.state.selectedIndex + 1;
          // }
          // nextItem = this.props.dataOptions[nextItemIndex];
          // this.handleChoose(
          //   nextItem.value,
          //   nextItem.label,
          //   nextItemIndex,
          //   true,
          //   () => {this.showList();}
          // );
          this.showList();
          this._filterFocusTimeout = setTimeout(() => { this.filterTextInput.focus(); }, 20);
        }
        break;
      case 38: // up
        e.preventDefault();
        if (this.state.showList) {
          if (this.state.renderedList.length > 0) {
            this.cursorPrev();
          }
        } else {
        //   if (this.state.selectedIndex === 0) {
        //     nextItemIndex = this.props.dataOptions.length - 1;
        //   } else {
        //     nextItemIndex = this.state.selectedIndex - 1;
        //   }
        //   nextItem = this.props.dataOptions[nextItemIndex];
        //   this.handleChoose(nextItem.value, nextItem.label, nextItemIndex, true);
          this.showList();
          this._filterFocusTimeout = setTimeout(() => { this.filterTextInput.focus(); }, 20);
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
    const selected = this.state.cursoredValue;
    switch (e.keyCode) {
      case 40: // down
        e.preventDefault();
        if (this.state.renderedList.length > 0) {
          this.cursorNext();
        }
        break;
      case 38: // up
        e.preventDefault();
        if (this.state.renderedList.length > 0) {
          this.cursorPrev();
        }
        break;
      case 27: // escape
        e.preventDefault();
        this.hideList();
        this._filterFocusTimeout = setTimeout(() => { this.control.focus(); }, 20);
        break;
      case 13: // enter
        e.preventDefault();
        if (typeof selected !== 'undefined') {
          this.handleChoose(this.state.cursoredValue, this.state.cursoredLabel);
        }
        break;
      case 9: // tab
        this.setState({
          showList: false,
          filtering: false,
        });
        // if listbox's filter field is focused (single selection), refocus the main control.
        if (e.target === this.filterTextInput) {
          e.preventDefault();
          this.control.focus();
        }
        break;
      default:
        if (e.target !== this.filterTextInput) {
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
    if (this.control) {
      return this.control.offsetWidth;
    }
  }

  handleFieldMouseDown() {
    if (this.state.showList) {
      this.hideList();
    } else {
      this.showList();
      this._filterFocusTimeout = setTimeout(() => { this.filterTextInput.focus(); }, 20);
    }
  }

  hideOnBlur(e) {
    if (this.container && document.activeElement !== document.body) {
      if (!contains(this.container, document.activeElement)) {
        if (!contains(this.selectList, document.activeElement)) {
          if (this.props.input) {
            this.props.input.onBlur(e);
          } else if (this.props.onBlur) {
            this.props.onBlur(e);
          }
          this.hideList();
        }
      }
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

  handleRootClose() {
    if (this.state.showList) {
      // be sure that nothing in the select is in focus before closing the option list.
      if (!contains(this.container, document.activeElement)) {
        // go ahead and execute redux-form validation...
        if (this.props.input && this.props.meta) {
          this.props.input.onBlur();
        }
        this.hideList();
      }
    }
  }

  getLabelElement() {
    const { label } = this.props;
    if (!label) {
      return null;
    }
    return (
      <label className={css.label} htmlFor={this.testId}>{label}</label>
    );
  }

  getControlClass() {
    let validationClasses = '';
    if (this.props.meta && this.props.meta.touched) {
      validationClasses = classNames(
        { [`${css.hasFeedback}`]: this.props.meta.error || this.props.meta.warning },
        { [`${css.feedbackWarning}`]: this.props.meta.warning },
        { [`${css.feedbackError}`]: this.props.meta.error },
        { [`${css.feedbackValid}`]: this.props.useValidStyle && !this.props.meta.error && !this.props.meta.warning },
      );
    }

    return classNames(
      validationClasses,
      css.selectionControl,
      { [`${css.rounded}`]: this.props.rounded },
      { [`${css.marginBottom0}`]: this.props.marginBottom0 },
    );
  }

  getCursoredId() {
    if (this.state.renderedList.length > 0) {
      return `option-${this.state.cursoredIndex}-${this.state.cursoredValue}`;
    }
    return '';
  }

  handleControlBlur() {
    if (this.props.input) {
      this.props.input.onBlur();
    } else if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  getWarningElement() {
    if (this.props.meta && this.props.meta.touched) {
      if (this.props.meta.warning) {
        return <div className={`${css.feedbackBlock} ${css.feedbackWarning}`}>{this.props.meta.warning}</div>;
      }
    }
    return null;
  }

  getErrorElement() {
    if (this.props.meta && this.props.meta.touched) {
      if (this.props.meta.error) {
        return <div className={`${css.feedbackBlock} ${css.feedbackError}`}>{this.props.meta.error}</div>;
      }
    }
    return null;
  }

  renderSelectedOption() {
    const { formatter, dataOptions } = this.props;
    const Formatter = formatter;
    const { selectedIndex, searchTerm } = this.state;
    if (selectedIndex !== -1) {
      // return this.props.formatter({option: this.props.dataOptions[this.state.selectedIndex], searchTerm: this.state.searchTerm });
      return (<Formatter option={dataOptions[selectedIndex]} searchTerm={searchTerm} />);
    }
    return false;
  }

  render() {
    const {
      input, // eslint-disable-line
      meta,  // eslint-disable-line
      tether,
      label,  // eslint-disable-line
    } = this.props;

    // detect smaller screen size...
    const atSmallMedia = window.matchMedia('(max-width: 800px)').matches;

    let listWidth = this.getInputWidth();
    if (atSmallMedia) {
      listWidth = '80%';
    }

    const labelElement = this.getLabelElement();
    const endControlElement = (
      <div className={css.SelectionEndControls}>
        <TextFieldIcon icon="down-triangle" />
      </div>);
    const warningElement = this.getWarningElement();
    const errorElement = this.getErrorElement();
    // const activeId = `option-${this.testId}-cursor`;

    const uiInput = (
      <div
        style={{ position: 'relative', width: '100%' }}
        ref={(ref) => { this.container = ref; }}
      >
        <SRStatus ref={(r) => { this._srstat = r; }} />
        {labelElement}
        <div className={css.SelectionControlContainer} >
          <div className="sr-only" id={`sl-${this.testId}-description`}>
            {this.state.selectedLabel || this.props.placeholder || 'none selected'}
          </div>
          <button
            role="listbox"
            type="button"
            onKeyDown={this.controlHandleKeyDown}
            onClick={this.handleFieldMouseDown}
            aria-describedby={`sl-${this.testId}-description`}
            aria-expanded={this.state.showList}
            aria-owns={`sl-${this.testId} sl-container-${this.testId}`}
            aria-activedescendant={this.getCursoredId()}
            className={this.getControlClass()}
            ref={(ref) => { this.control = ref; }}
            id={this.testId}
            name={this.props.name || this.props.input.name}
            onFocus={this.props.input ? this.props.input.onFocus : this.props.onFocus}
            onBlur={this.hideOnBlur}
            autoFocus={this.props.autoFocus}
          >
            <div className={css.singleValue}>
              { this.renderSelectedOption() || this.props.placeholder}
            </div>
          </button>
          {endControlElement}
        </div>
        <div aria-live="assertive">
          {warningElement}
          {errorElement}
        </div>
      </div>
    );

    const selectList = (
      <SelectList
        visible={this.state.showList}
        cursoredValue={this.state.cursoredValue}
        activeId={this.getCursoredId()}
        id={this.props.id}
        label={this.props.label}
        width={listWidth}
        maxHeight={this.props.listMaxHeight}
        list={this.state.renderedList}
        onChoose={this.handleChoose}
        filtered={this.state.filtering}
        onClose={this.hideOnBlur}
        selected={this.state.selectedValue}
        selectedIndex={this.state.selectedIndex}
        selectedLabel={this.state.selectedLabel}
        selectedList={[]}
        rootRef={(ref) => { this.selectList = ref; }}
        filterRef={(ref) => { this.filterTextInput = ref; }}
        ref={(ref) => { this.picker = ref; }}
        emptyMessage={this.props.emptyMessage}
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
        <div ref={(ref) => { this.container = ref; }}>
          {uiInput}
          {this.state.showList &&
            <Portal container={document.getElementById('root')}>
              <div
                role="presentation"
                className={css.selectAheadMobileBackdrop}
                onClick={() => { this.hideList(); }}
              >
                {selectList}
              </div>
            </Portal>
          }
        </div>
      );
    }

    const mergedTetherProps = Object.assign({}, SingleSelect.defaultProps.tether, tether);

    return (
      <TetherComponent {...mergedTetherProps}>
        {uiInput}
        <RootCloseWrapper onRootClose={this.handleRootClose} >
          {selectList}
        </RootCloseWrapper>
      </TetherComponent>
    );
  }
}

SingleSelect.defaultProps = defaultProps;
SingleSelect.propTypes = propTypes;

export default SingleSelect;
