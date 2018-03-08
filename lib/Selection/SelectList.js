import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import css from './Selection.css';
import HighLight from 'react-highlighter';

const propTypes = {
  visible: PropTypes.bool,
  selected: PropTypes.string,
  list: PropTypes.arrayOf(PropTypes.object),
  searchTerm: PropTypes.string,
  onChoose: PropTypes.func,
  id: PropTypes.string,
  rootRef: PropTypes.func,
  emptyMessage: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  filtered: PropTypes.bool,
  onClose: PropTypes.func,
  activeId: PropTypes.string,
  multiple: PropTypes.bool,
};

class SelectList extends React.Component {
  constructor(props) {
    super(props);

    this._cursorID = this.initCursorID(props);
    this.container = null;
    this.filterField = null;
    this.containerHeight = 0;
    this.trigger = null;
    this.getClass = this.getClass.bind(this);
    this.getCursorValue = this.getCursorValue.bind(this);
    this.getCursorID = this.getCursorID.bind(this);
    this.setRefs = this.setRefs.bind(this);
    this.scrollToCursor = this.scrollToCursor.bind(this);
    this.selectedDisplay = this.selectedDisplay.bind(this);
    this.initCursorValue = this.initCursorValue.bind(this);
    this.setFilterFieldRef = this.setFilterFieldRef.bind(this);
    this.animationCallback = null;
    this.getRootClass = this.getRootClass.bind(this);
    this.renderList = this.renderList.bind(this);

    this.state = {
      cursorValue: this.initCursorValue(this.props),
    };
  }

  shouldComponentUpdate(nextProps) {
    if (!this.props.visible && !nextProps.visible) {
      return false;
    }
    return true;
  }

  initCursorID(props) {
    if (props.selected) {
      return `option-${props.selectedIndex}-${props.selected}`;
    }
    return `option-0-${props.list[0].value}`;
  }

  initCursorValue(props) {
    if (props.selected !== '') {
      if (props.filtered) {
        return props.list[0];
      } else {
        const selectedInd = this.props.list.findIndex( o => o.value === this.props.selected );
        return this.props.list[selectedInd];
      }
    }
    return props.list[0];
  }

  getCursorID() {
    return this._cursorID;
  }

  componentDidMount() {
    if(this.props.selected && !this.props.filtered){
      this.scrollToCursor(true);
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.filtered) {
      // set cursor to first visible item if search string is updated...
      if (nextProps.searchTerm !== this.props.searchTerm) {
        this.setState({
          cursorValue: nextProps.list[0],
        });
      }
    } else {
      if (this.props.selectedIndex !== nextProps.selectedIndex) {
        this.setState({
          cursorValue: nextProps.list[nextProps.selectedIndex],
        });
      }
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationCallback);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      if(this.props.selected) {
        this.scrollToCursor(true);
      }
    } else if (this.props.filtered) {
      this.scrollToCursor();
    }

    if(this.props.cursoredValue != prevProps.cursoredValue) {
      this.scrollToCursor();
    }
  }

  scrollToCursor(useSelected) {
    if (this.props.list.length > 0) {
      this.animationCallback = requestAnimationFrame( () => {
        let cursored;
        if(useSelected && this.props.selected !== '') {
          cursored = this.container.querySelector(`.${css.selected}`);
          if ( cursored ) {
            this.container.scrollTop = cursored.offsetTop;
          }
        } else {
          cursored = this.container.querySelector(`.${css.cursor}`);
          if (cursored) {
            if (cursored.offsetTop > this.container.scrollTop + this.container.offsetHeight - 30) {
              let newScroll = cursored.offsetTop - (this.container.offsetHeight - cursored.offsetHeight);
              this.container.scrollTop = newScroll;
            } else if ( cursored.offsetTop < this.container.scrollTop) {
              this.container.scrollTop = cursored.offsetTop;
            }
          }
        }
      });
    }
  }

  getCursorValue() {
    return this.state.cursorValue ? this.state.cursorValue : null;
  }

  getClass(o) {
    if ( this.props.list.length > 0) {
      let selectCriteria;
      if (!this.props.multiple) {
        selectCriteria = o.value == this.props.selected;
      } else {
        selectCriteria = ( this.props.selectedList.findIndex(i => i.value === o.value) !== -1);
      }

      return classnames(
        css.option,
        {[`${css.cursor}`]:o.value == this.props.cursoredValue},
        {[`${css.selected}`]:selectCriteria},
      );
    }
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
    if(this.props.selected !== '') {
      return <strong>{this.props.selectedLabel}</strong>;
    } else {
      return 'filtering... nothing';
    }
  }

  getRootClass() {
    return classnames(
      css.selectionListRoot,
      {"sr-only": !this.props.visible} 
    );
  }

  getActionIndicator(o) {
    const selectCriteria = ( this.props.selectedList.findIndex(i => i.value === o.value) !== -1);
    return selectCriteria ? <span title="click to remove selection">&#x2796;</span> : <span title="click to add to selection">&#x271A;</span>;
  }

  renderList() {
    if (this.props.list.length === 0) {
      return (
        <li className={css.option}><strong>{this.props.emptyMessage}</strong></li>
      );
    }
    
    return this.props.list.map((o, i) => {
        return (
          <li 
            key={`option-${i}-${o.value}`}
            role="option"
            tabIndex="-1"
            unselectable="on"
            aria-selected={o.value === this.props.selected}
            id={`option-${i}-${o.value}`}
            className={this.getClass(o)}
            onClick={() => {this.props.onChoose(o.value, o.label)}}
          >
            <HighLight search={this.props.searchTerm || ''}>{o.label}</HighLight>
            {
              this.props.multiple &&
              this.getActionIndicator(o) 
            }
          </li>
        );
      });
  }

  render() {
    return (
      <div 
        aria-hidden={this.props.visible ? undefined : "true"}
        className={this.getRootClass()} 
        style={{width: this.props.width }}
        id={`sl-container-${this.props.id}`}
      >
      { !this.props.multiple &&
      <div className={css.SelectionFilterContainer}>
        <input 
          role="textbox"
          aria-label={`${this.props.label}-option-filter`}
          placeholder="filter options list"
          onKeyDown={this.props.onFilterKeyDown}
          onChange={this.props.onFilter}
          value={this.props.searchTerm}
          className={css.SelectionFilter}
          type="text"
          ref={this.setFilterFieldRef}
          aria-controls={`sl-${this.props.id}`}
          aria-activedescendant={this.props.activeId}
        />
      </div>
      }
      <ul 
        role="listbox"
        className={css.selectionList}
        style={{maxHeight: this.props.maxHeight }}
        ref={this.setRefs}
        id={`sl-${this.props.id}`}
        aria-live="polite"
        aria-multiselectable="false"
        aria-label={`${this.props.label}-option-list`}
      >
        {this.props.visible && this.renderList()}
      </ul>
      </div>
    );
  }
}

SelectList.propTypes = propTypes;

export default SelectList;
