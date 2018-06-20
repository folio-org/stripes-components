/* SelectList
*  Used by both SingleSelect and MultiSelect controls to render their option lists
*/

import React from 'react';
import { intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DefaultOptionFormatter from './DefaultOptionFormatter';
import css from './Selection.css';

const propTypes = {
  activeId: PropTypes.string,
  cursoredValue: PropTypes.string,
  emptyMessage: PropTypes.string,
  filtered: PropTypes.bool,
  filterRef: PropTypes.func,
  formatter: PropTypes.func,
  id: PropTypes.string,
  label: PropTypes.string,
  list: PropTypes.arrayOf(PropTypes.object),
  maxHeight: PropTypes.string,
  multiple: PropTypes.bool,
  onChoose: PropTypes.func,
  onFilter: PropTypes.func,
  onFilterKeyDown: PropTypes.func,
  optionAlignment: PropTypes.string,
  rootRef: PropTypes.func,
  searchTerm: PropTypes.string,
  selected: PropTypes.string,
  selectedIndex: PropTypes.number,
  selectedLabel: PropTypes.string,
  selectedList: PropTypes.arrayOf(PropTypes.object),
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

const defaultProps = {
  formatter: DefaultOptionFormatter,
  maxHeight: '174px',
  optionAlignment: 'outside',
  searchTerm: '',
  onEmptyClick: () => null,
};

const contextTypes = {
  intl: intlShape,
};

class SelectList extends React.Component { // eslint-disable-line react/no-deprecated
  constructor(props) {
    super(props);

    this._cursorID = this.initCursorID();
    this.emptyId = `${this.props.id}-empty-message`
    this.container = null;
    this.filterField = null;
    this.optionList = null;
    this.containerHeight = 0;
    this.trigger = null;
    this.getClass = this.getClass.bind(this);
    this.getCursorID = this.getCursorID.bind(this);
    this.setRefs = this.setRefs.bind(this);
    this.scrollToCursor = this.scrollToCursor.bind(this);
    this.selectedDisplay = this.selectedDisplay.bind(this);
    this.initCursorValue = this.initCursorValue.bind(this);
    this.setFilterFieldRef = this.setFilterFieldRef.bind(this);
    this.handleOptionClick = this.handleOptionClick.bind(this);
    this.animationCallback = null;
    this.getRootClass = this.getRootClass.bind(this);
    this.renderList = this.renderList.bind(this);

    this.state = {
      cursorValue: this.initCursorValue(this.props),
    };

    this._alignmentClass = '';
    switch (props.optionAlignment) {
      case 'outside':
        this._alignmentClass = css.optionOutside;
        break;
      case 'start':
        this._alignmentClass = css.optionStart;
        break;
      case 'end':
        this._alignmentClass = css.optionEnd;
        break;
      case 'center':
        this.alignmentClass = css.optionCentered;
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    if (this.props.selected && !this.props.filtered) {
      this.scrollToCursor(true);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (!this.props.visible && !nextProps.visible) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps) {
    // if listbox is appearing...
    if (!prevProps.visible && this.props.visible) {
      if (this.props.selected) {
        this.scrollToCursor(true);
      }
      if (this.filterField) { //filter field not present in 'multiple' mode.
        this.filterField.focus();
      }
    } else if (this.props.filtered) {
      this.scrollToCursor();
    }

    if (this.props.cursoredValue !== prevProps.cursoredValue) {
      this.scrollToCursor();
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationCallback);
  }

  initCursorID() {
    if (this.props.selected) {
      return `option-${this.props.selectedIndex}-${this.props.selected}`;
    }

    if (this.props.list.length) {
      return `option-0-${this.props.list[0].value}`;
    }

    return '';
  }

  initCursorValue(props) {
    if (props.selected !== '') {
      if (props.filtered) {
        return props.list[0];
      } else {
        const selectedInd = this.props.list.findIndex(o => o.value === this.props.selected);
        return this.props.list[selectedInd];
      }
    }
    return props.list[0];
  }

  getCursorID() {
    return this._cursorID;
  }

  scrollToCursor(useSelected) {
    if (this.props.list.length > 0) {
      this.animationCallback = requestAnimationFrame(() => {
        let cursored;
        if (useSelected && this.props.selected !== '') {
          if(this.optionList) {
            cursored = this.optionList.querySelector(`.${css.selected}`);
            if (cursored) {
              this.optionList.scrollTop = cursored.offsetTop;
            }
          }
        } else if (this.container){
          cursored = this.container.querySelector(`.${css.cursor}`);
          if (cursored) {
            if (cursored.offsetTop > ((this.optionList.scrollTop + this.optionList.offsetHeight) - 30)) {
              const newScroll = cursored.offsetTop - (this.optionList.offsetHeight - cursored.offsetHeight);
              this.optionList.scrollTop = newScroll;
            } else if (cursored.offsetTop < this.optionList.scrollTop) {
              this.optionList.scrollTop = cursored.offsetTop;
            }
          }
        }
      });
    }
  }

  getClass(o) {
    // selected class..
    let selectCriteria;
    if (!this.props.multiple) {
      selectCriteria = o.value === this.props.selected;
    } else {
      selectCriteria = (this.props.selectedList.findIndex(i => i.value === o.value) !== -1);
    }

    return classnames(
      css.option,
      this._alignmentClass,
      { [`${css.cursor}`]: o.value === this.props.cursoredValue },
      { [`${css.selected}`]: selectCriteria },
    );
  }

  setFilterFieldRef(ref) {
    this.filterField = ref;
    this.props.filterRef(ref);
  }

  setRefs(ref) {
    this.props.rootRef(ref);
    this.container = ref;
  }

  selectedDisplay() {
    if (this.props.selected !== '') {
      return <strong>{this.props.selectedLabel}</strong>;
    } else {
      return 'filtering... nothing';
    }
  }

  getRootClass() {
    return classnames(
      css.selectionListRoot,
      { 'sr-only': !this.props.visible },
    );
  }

  getActionIndicator(o) {
    const selectCriteria = (this.props.selectedList.findIndex(i => i.value === o.value) !== -1);
    const removeMsg = this.context.intl.formatMessage({ id: 'stripes-components.removeSelection' });
    const addMsg = this.context.intl.formatMessage({ id: 'stripes-components.addSelection' });
    return selectCriteria ? <span role="img" aria-label={removeMsg}>&#x2796;</span> : <span role="img" aria-label={addMsg}>&#x271A;</span>;
  }

  handleOptionClick(o) {
    this.props.onChoose(o.value, o.label);
    this.props.onClickItem();
  }

  renderList() {
    if (this.props.list.length === 0) {
      return (
        <li
          className={css.option}
          role="option"
          tabIndex="-1"
          unselectable="on"
          aria-selected="false"
          id={`option-${this.props.id}-no-available-options`}
          onClick={() => { this.props.emptyOnClick(); }}
          role="alert"
        ><strong>{this.props.emptyMessage}</strong></li>
      );
    }

    const Formatter = this.props.formatter;

    return this.props.list.map((o, i) => (
      <li
        key={`option-${i}-${o.value}`}
        role="option"
        tabIndex="-1"
        unselectable="on"
        aria-selected={o.value === this.props.selected}
        id={`option-${this.props.id}-${i}-${o.value}`}
        className={this.getClass(o)}
        onClick={() => { this.handleOptionClick(o); }}
      >
        <Formatter option={o} searchTerm={this.props.searchTerm} />
        {
          this.props.multiple &&
          this.getActionIndicator(o)
        }
      </li>
    ));
  }

  // returns the activeId, or if the list is empty, returns the id for the "empty message" list item.
  getActiveId() {
    if(this.props.list.length > 0) {
      return this.props.activeId;
    }
    return this.emptyId;
  }

  render() {
    return (
      <div
        hidden={this.props.visible ? undefined : 'true'}
        className={this.getRootClass()}
        style={{ width: this.props.width }}
        id={`sl-container-${this.props.id}`}
        ref={this.setRefs}
        onKeyDown={this.props.onFilterKeyDown}
      >
        {
        !this.props.multiple &&
        <div className={css.SelectionFilterContainer}>
          <input
            type="text"
            role="listbox"
            aria-label={`${this.props.label} option filter`}
            placeholder="Filter options list"
            onChange={this.props.onFilter}
            value={this.props.searchTerm}
            className={css.SelectionFilter}
            ref={this.setFilterFieldRef}
            aria-owns={`sl-${this.props.id}`}
            aria-activedescendant={this.props.activeId}
          />
        </div>
       }
        <ul
          className={css.selectionList}
          style={{ maxHeight: this.props.maxHeight }}
          ref={(ref) => {this.optionList = ref;}}
          id={`sl-${this.props.id}`}
        >
          {this.renderList()}
        </ul>
      </div>
    );
  }
}

SelectList.propTypes = propTypes;
SelectList.defaultProps = defaultProps;
SelectList.contextTypes = contextTypes;

export default SelectList;
