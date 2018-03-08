import React from 'react';
import PropTypes from 'prop-types';
import TextField from '../TextField';
import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import TextFieldIcon from '../TextField/TextFieldIcon';
import TetherComponent from 'react-tether';
import Portal from 'react-overlays/lib/Portal'
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import uniqueId from 'lodash/uniqueId';
import contains from 'dom-helpers/query/contains';
import SelectList from './SelectList';
import MultiSelector from './Multiselector';
import IconButton from '../IconButton';
import SRStatus from '../SRStatus';
import css from './Selection.css';

const propTypes = {
  emptyMessage: PropTypes.string,
  listMaxHeight: PropTypes.string,
  hideOnSelection: PropTypes.bool,
  tether: PropTypes.object,
  label: PropTypes.string,
  input: PropTypes.object,
  meta: PropTypes.object,
  multiple: PropTypes.bool,
}

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
  listMaxHeight: '200px',
  hideOnSelection: true,
  multiple: false,
};

class MultiSelect extends React.Component {
  constructor(props) {
    super(props);

    this.container = null;
    this.filterTextInput = null;
    this.selectList = null;
    this.picker = null;
    this.control = null;

    this.handleChoose = this.handleChoose.bind(this);
    this.filterList = this.filterList.bind(this);
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
    this.initValueList = this.initValueList.bind(this);
    this.handleRemoveMultiSelection = this.handleRemoveMultiSelection.bind(this);
    this.backSpaceRemoveValue = this.backSpaceRemoveValue.bind(this);
    this.clearAllSelected = this.clearAllSelected.bind(this);
    this.cursorPreviousSelectedItem = this.cursorPreviousSelectedItem.bind(this);
    this.cursorNextSelectedItem = this.cursorNextSelectedItem.bind(this);
    this.getTextDirection = this.getTextDirection.bind(this);

    const initialCursor = this.initCursor();

    this.state = {
      
      // cursored item info within vertical list...
      cursoredIndex: initialCursor.index,
      cursoredValue: initialCursor.value,
      cursoredLabel: initialCursor.label,

      // selected value(s) info...
      selectedList: this.initValueList(),

      // item selected within the currently selected values (the "tags" with the X buttons on them)
      selectedItemsCursorLabel: "",
      selectedItemsCursorValue: "",
      selectedItemsCursorIndex: -1,

      // controls display of the list...
      showList: false,

      // for filtering the list
      searchTerm: '',
      filtering: false,
      renderedList: this.props.dataOptions,
    }

    if (this.props.id) {
      this.testId = this.props.id;
    } else {
      this.testId = uniqueId('stripes-selection-');
    }
  }

  componentWillUpdate(prevProps, prevState) {
    // if the select list is being shown and an item is selected, sync the cursor...
    if (this.state.selectedList.length > 0) {
      if (!prevState.showList && this.state.showList) {
        this.setState((curState) => {
          const newState = Object.assign({}, curState);
          newState.cursoredIndex = curState.selectedList[0].index;
          newState.cursoredValue = curState.selectedList[0].value;
          newState.cursoredLabel = curState.selectedList[0].label;
          return newState;
        });
      }
    }
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
        if (searchValue === "") { // in the case of RF, nothing selected, so cursor the 1st...
          cursorObject.index = 0;
          cursorObject.value = this.props.dataOptions[0].value;
          cursorObject.label = this.props.dataOptions[0].label;
          return cursorObject;
        }
      } else if (this.props.value) {
        searchValue = this.props.value;
      }
      if (typeof searchValue !== 'undefined') {
        valueIndex = this.props.dataOptions.findIndex((o) => o.value === searchValue);
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
    if(!value) {
      if (this.props.input.value) {
        if(Array.isArray(this.props.input.value)) {
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
    const selectedObject = { value: '', index: -1, label: '' };
    let valueIndex;
    let searchValue;
    if (this.props.dataOptions.length > 0) {
      if (typeof _value !== 'undefined') { // in the case of RF, nothing selected, so cursor the 1st...
        valueIndex = this.props.dataOptions.findIndex((o) => o.value === _value);
        if (valueIndex !== -1) {
          selectedObject.value = _value;
          selectedObject.index = valueIndex;
          selectedObject.label = this.props.dataOptions[valueIndex].label;
        }
      }
    }
    return selectedObject;
  }

  initValueList() {
    let valueVList;
    let valueArray = [];
    if (this.props.input) {
      if (Array.isArray(this.props.input.value)) {
        if (this.props.input.value.length === 0) {
          return [];
        }
        valueVList = this.props.input.value;
      } else {
        if (this.props.input.value === "") {
          return [];
        }
        valueVList = [this.props.input.value];
      }
    }
    valueVList.forEach( v => {
      valueArray.push(this.initValue(v));
    })
    return valueArray;
  }

  handleChoose(value, label, index, maintainPicker, callback) {
    // get index from full list
    let selIndex
    if (index) {
      selIndex = index;
    } else {
      selIndex = this.props.dataOptions.findIndex(o => o.value === value && o.label === label);
    }

    let vList;
    if (this.props.input) {
      vList = cloneDeep(this.props.input.value);
    } else {
      vList = cloneDeep(this.props.value);
    }

    // if value is already selected, we should remove it from the selected list...
    if (vList !== "" && vList.findIndex(v => v === value) !== -1) {
      this.handleRemoveMultiSelection(value, null);
      return;
    }

    if (vList === "") {
      vList = [];
    }
    vList.push(value);

    this.setState( (curState) => {
      const newState = cloneDeep(curState);
      newState.selectedList.push({value, label, index: selIndex});
      newState.renderedList = this.props.dataOptions;
      newState.filtering = false;
      newState.searchTerm = "";
      return newState;
    }, callback);
  
    /*  refocus the control prior to calling the onChange handler - 
        the new value doesn't seem to stick if the change happens first. */
    this.control.focus();

    if (this.props.input) {
      this.props.input.onChange(vList);
    } else if (this.props.onChange) {
      this.props.onChange(vList, e);
    }
    
    
    if(!this.maintainPicker) {
      if (!this.props.multiple) {
        this.hideList();
      }
    }

    // inform screen reader of selection...
    this._srstat.sendMessage(`${this.state.cursoredLabel} added to selection. ${this.state.selectedList.length + 1} items selected`);

  }

  filterList(e) {
    const presented = this.props.dataOptions.filter(o => new RegExp(`^${e.target.value}`, 'i').test(o.label));

    // update context for screen-reader user
    let ariaMessage;
    let cIndex;
    let cLabel;
    let cValue;
    if (presented.length === 0) {
      cIndex = -1;
      cLabel = "";
      cValue = "";
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
      () => {this._srstat.sendMessage(ariaMessage)}
    );
  }

  cursorNext() {
    if (this.state.renderedList.length > 0) {
      this.setState((curState) => {
        const newState = Object.assign({}, curState, );
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
        const newState = Object.assign({}, curState, );
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

  // moves selection among selected items...
  cursorPreviousSelectedItem() {
    if ( this.state.selectedItemsCursorIndex === -1) {
      this.setState((curState) => {
        const newState = cloneDeep(curState);
        const last = this.state.selectedList.length - 1;
        newState.selectedItemsCursorLabel = this.state.selectedList[last].label;
        newState.selectedItemsCursorValue = this.state.selectedList[last].value;
        newState.selectedItemsCursorIndex = last;
        return newState;
      });
    } else {
      this.setState((curState) => {
        const newState = cloneDeep(curState);
        const prev = newState.selectedItemsCursorIndex - 1;
        if (prev === -1) {
          newState.selectedItemsCursorLabel = "";
          newState.selectedItemsCursorValue = "";
          newState.selectedItemsCursorIndex = prev;
        } else {
          newState.selectedItemsCursorLabel = this.state.selectedList[prev].label;
          newState.selectedItemsCursorValue = this.state.selectedList[prev].value;
          newState.selectedItemsCursorIndex = prev;
        }
        return newState;
      });
    }
  }

  cursorNextSelectedItem() {
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      const next = newState.selectedItemsCursorIndex + 1;
      if (next === newState.selectedList.length) {
        newState.selectedItemsCursorLabel = "";
        newState.selectedItemsCursorValue = "";
        newState.selectedItemsCursorIndex = -1;
      } else {
        newState.selectedItemsCursorLabel = this.state.selectedList[next].label;
        newState.selectedItemsCursorValue = this.state.selectedList[next].value;
        newState.selectedItemsCursorIndex = next;
      }
      return newState;
    });
  }

  filterHandleKeyDown(e) {
    const selected = this.state.cursoredValue;
    switch (e.keyCode) {
      case 40: // down
        e.preventDefault();
        if (this.props.multiple) {
          if (!this.state.showList) {
            this.showList();
          } else {
            if (this.state.renderedList.length > 0) {
              this.cursorNext();
            }
          }
        } else {
          if (this.state.renderedList.length > 0) {
            this.cursorNext();
          }
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
        break;
      case 39: // right
        // for multiSelection, navigate between selected options.
        if (this.props.multiple && this.state.searchTerm === "" && this.state.selectedList.length > 0) {
          e.preventDefault();
          if (this.getTextDirection() === "ltr") {
            this.cursorNextSelectedItem();
          } else {
            this.cursorPreviousSelectedItem();
          }
        }
        break;
      case 37: // left
        // for multiSelection, navigate between selected options.
        if (this.props.multiple && this.state.searchTerm === "" && this.state.selectedList.length > 0) {
          e.preventDefault();
          if (this.getTextDirection() === "ltr") {
            this.cursorPreviousSelectedItem();
          } else {
            this.cursorNextSelectedItem();
          }
        }
        break;
      // case 34: // pgDn
      //   e.preventDefault();
      //   break;
      // case 33: // pgUp
      //   e.preventDefault();
      //   break;
      case 13: // enter
        if (this.state.showList) {
          if (selected) {
            this.handleChoose(this.state.cursoredValue, this.state.cursoredLabel);
          }
        } else {
          this.showList();
        }
        break;
      case 16: // shift
        break;
      case 9: // tab
        this.setState({
          showList: false,
          filtering: false,
          selectedItemsCursorLabel: "",
          selectedItemsCursorValue: "",
          selectedItemsCursorIndex: -1
        });
        break;
      case 46: // delete key
        if (this.state.selectedItemsCursorIndex !== -1) {
          this.handleRemoveMultiSelection(this.state.selectedItemsCursorValue, e);
        }
        break;
      case 8: // backspace - in multiselect this can be used to delete selected values
        if (e.target.value === "") {
          this.backSpaceRemoveValue(e);
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

  backSpaceRemoveValue(e) {
    let _value;
    if (this.props.input) {
      _value = this.props.input.value;
    } else {
      _value = this.props.value;
    }

    const valueToRemove = _value[_value.length - 1];
    this.handleRemoveMultiSelection(valueToRemove, e);
  }

  clearAllSelected(e) {
    e.stopPropagation();

    this.setState({
      cursoredIndex: 0,
      cursoredValue: this.props.dataOptions[0].value,
      cursoredLabel: this.props.dataOptions[0].label,
      renderedList: this.props.dataOptions,
      showList: false,
      searchTerm: "",
      selectedList: [],
    });

    this.filterTextInput.focus();

    if(this.props.input) {
      this.props.input.onChange("");
    } else {
      this.props.onChange("", e);
    }

    this._srstat.sendMessage("Selected list cleared");
  }

  getInputWidth() {
    if (this.control) {
      return this.control.offsetWidth;
    }
  }

  handleFieldMouseDown() {
    if (this.state.showList) {
      this.hideList();
    } else {
      // for multiselect, focus input before showing so that rootClose won't accidentally be triggered
      if (this.props.multiple) {
        this.filterTextInput.focus();
      }
      this.showList();
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

  showList() {
    this.setState({
      showList: true,
      searchTerm: "",
    });
  }

  hideList() {
    this.setState({
      showList: false,
      searchTerm: "",
    });
  }

  handleRootClose() {
    // be sure that nothing in the datepicker is in focus before closing the calendar.
    if (!contains(this.container, document.activeElement)) {
      this.hideList();
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
    return classNames(
      css.selectionControl,
      { [`${css.rounded}`]: this.props.rounded },
    );
  }

  getCursoredId() {
    if (this.state.selectedItemsCursorLabel === "") {
      if (this.state.renderedList.length > 0) {
        return `option-${this.state.cursoredIndex}-${this.state.cursoredValue}`;
      }
      return ""
    }
    return `${this.testId}-selected-${this.state.selectedItemsCursorLabel}-${this.state.selectedItemsCursorValue}`;
  }

  handleControlBlur() {
    if (this.props.input) {
      this.props.input.onBlur();
    } else if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  // only used with multiselection to do removal when user clicks the "X" or backspaces...
  handleRemoveMultiSelection(value, e) {
    if (e) { 
      e.stopPropagation();
    }

    let _valueList;
    let _removedLabel;
    const indToRemove = this.state.selectedList.findIndex(v => v.value === value);
    _removedLabel = this.state.selectedList[indToRemove].label;

    if (this.props.input) {
      _valueList = cloneDeep(this.props.input.value);
    } else {
      _valueList = cloneDeep(this.props.value);
    }
    const indexToRemove = _valueList.findIndex(v => v === value);
    
    _valueList.splice(indexToRemove, 1);

    this.setState(curState => {
      const newState = cloneDeep(curState);
      const selectedIndToRemove = newState.selectedList.findIndex(v => v.value === value);
      _removedLabel = newState.selectedList[selectedIndToRemove].label;
      newState.selectedList.splice(selectedIndToRemove, 1);
      return newState;
    });

    // if a selected item is cursored, select the next item, if possible
    if (this.state.selectedItemsCursorIndex !== -1) {
      this.cursorPreviousSelectedItem();
    }

    if (this.props.input) {
      this.props.input.onChange(_valueList);
    } else {
      this.props.onChange(_valueList, e);
    }

    // inform screen reader of removal...
    this._srstat.sendMessage(`${_removedLabel} removed from selection. ${this.state.selectedList.length - 1} items selected`);
  }

  getEndControl() {
    if (this.state.selectedList.length > 0) {
      return (<IconButton icon="closeX" className={css.SelectionClearAll} size="small" title="clear all values" onClick={this.clearAllSelected} />);
    }
    return (<TextFieldIcon icon="down-triangle" />);
  }

  render() {
    const {
      input,
      meta,
      tether,
      label,
    } = this.props;

    // detect smaller screen size...
    const atSmallMedia = window.matchMedia("(max-width: 800px)").matches;

    let listWidth = this.getInputWidth();
    if (atSmallMedia) {
      listWidth = "80%";
    }

    const labelElement = this.getLabelElement();
    const endControlElement = (
      <div className={css.SelectionEndControls}>
        {this.getEndControl()}
      </div>);
    const warningElement = null;
    const errorElement = null;
    const activeId = `option-${this.testId}-cursor`;

    const uiInput = (
      <div
        style={{ position: 'relative', width: '100%' }}
        ref={(ref) => { this.container = ref; }}
      >
        <SRStatus ref={(r) => {this._srstat = r;}} />
        {labelElement}
        <div className={css.SelectionControlContainer} >
          <div id={`selection-value-${this.testId}`} className="sr-only">
            {this.state.searchTerm || 'none selected'}
          </div>
          <MultiSelector
            valueList={this.state.selectedList}
            placeholder={this.props.placeholder}
            onRemoveValue={this.handleRemoveMultiSelection}
            controlRef={(ref) => { this.control = ref; }}
            readOnly={this.props.readOnly}
            onMouseDown={this.handleFieldMouseDown}
            onFilterKeyDown={this.filterHandleKeyDown}
            onFilter={this.filterList}
            searchTerm={this.state.searchTerm}
            selectedItemsCursorValue={this.state.selectedItemsCursorValue}
            selectedItemsCursorLabel={this.state.selectedItemsCursorLabel}
            inputRef={(r) => {this.filterTextInput = r;}}
            listVisible={this.state.showList}
            id={this.testId}
            activeId={this.getCursoredId()}
          />
          {endControlElement}
        </div>
        <div aria-live="assertive">
          {warningElement}
          {errorElement}
        </div>
      </div>
    );

    let selectedObject;
    if (this.state.selectedList.length === 0) {
      selectedObject = {
        index: 0,
        value: "",
        label: "",
      }
    } else {
      selectedObject = this.state.selectedList[0];
    } 

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
        selected={selectedObject.value}
        selectedIndex={selectedObject.index}
        selectedLabel={selectedObject.label}
        selectedList={this.state.selectedList}
        rootRef={(ref) => { this.selectList = ref; }}
        filterRef={(ref) => { this.filterTextInput = ref; }}
        ref={(ref) => { this.picker = ref; }}
        emptyMessage={this.props.emptyMessage}
        searchTerm={this.state.searchTerm}
        onFilter={this.filterList}
        onFilterKeyDown={this.filterHandleKeyDown}
        controlledBy={this.control}
        multiple={this.props.multiple}
      />
    );

    if (atSmallMedia) {
      return (
        <div ref={(ref) => { this.container = ref; }}>
          {uiInput}
          {this.state.showList &&
            <Portal container={document.getElementById("root")}>
              <div
                className={css.selectAheadMobileBackdrop}
                onClick={() => { this.hideList() }}
              >
                {selectList}
              </div>
            </Portal>
          }
        </div>
      )
    }

    const mergedTetherProps = Object.assign({}, MultiSelect.defaultProps.tether, tether);

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

MultiSelect.defaultProps = defaultProps;
MultiSelect.propTypes = propTypes;

export default MultiSelect;
