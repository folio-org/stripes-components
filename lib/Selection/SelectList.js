/* SelectList
*  Used by both SingleSelect and MultiSelect controls to render their option lists
*/

import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import DefaultOptionFormatter from './DefaultOptionFormatter';

import css from './Selection.css';

const propTypes = {
  activeId: PropTypes.string,
  controlRef: PropTypes.object,
  cursoredValue: PropTypes.string,
  emptyMessage: PropTypes.node,
  filtered: PropTypes.bool,
  filterRef: PropTypes.object,
  formatter: PropTypes.func,
  id: PropTypes.string,
  label: PropTypes.node,
  list: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  loadingMessage: PropTypes.node,
  maxHeight: PropTypes.string,
  onChoose: PropTypes.func,
  onClickItem: PropTypes.func,
  onFilter: PropTypes.func,
  onFilterKeyDown: PropTypes.func,
  optionAlignment: PropTypes.string,
  rootRef: PropTypes.object,
  searchTerm: PropTypes.string,
  selected: PropTypes.string,
  selectedIndex: PropTypes.number,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

const defaultProps = {
  formatter: DefaultOptionFormatter,
  maxHeight: '174px',
  optionAlignment: 'outside',
  searchTerm: '',
  filterRef: React.createRef(),
  rootRef: React.createRef(),
};

class SelectList extends React.Component {
  constructor(props) {
    super(props);

    this._cursorID = this.initCursorID();
    this.emptyId = `${this.props.id}-empty-message`;
    this.container = this.props.rootRef;
    this.filterField = this.props.filterRef;
    this.optionList = React.createRef();
    this.containerHeight = 0;
    this.getClass = this.getClass.bind(this);
    this.scrollToCursor = this.scrollToCursor.bind(this);
    this.handleOptionClick = this.handleOptionClick.bind(this);
    this.animationCallback = null;
    this.getRootClass = this.getRootClass.bind(this);
    this.renderList = this.renderList.bind(this);
    this.getAlert = this.getAlert.bind(this);

    switch (props.optionAlignment) {
      case 'start':
        this._alignmentClass = css.optionStart;
        break;
      case 'end':
        this._alignmentClass = css.optionEnd;
        break;
      case 'center':
        this._alignmentClass = css.optionCentered;
        break;
      default:
        this._alignmentClass = css.optionOutside;
    }
  }

  componentDidMount() {
    if (this.props.selected && !this.props.filtered) {
      this.scrollToCursor(true);
    }

    this.props.filterRef.current.focus();
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
      if (this.filterField.current) { // filter field not present in 'multiple' mode.
        this.filterField.current.focus();
      }
    } else if (this.props.filtered) {
      this.scrollToCursor();
    }

    // like a good overlay, send focus back to our trigger when we close...
    if (prevProps.visible && !this.props.visible) {
      if (this.props.controlRef.current) {
        // we only need to send focus back to the control if focus is still within the list.
        if(this.container.current.matches(':focus-within')) {
          this.props.controlRef.current.focus();
        }
      }
    }

    if (this.props.cursoredValue !== prevProps.cursoredValue) {
      this.scrollToCursor();
    }

    if (prevProps.searchTerm !== '' && this.props.searchTerm === '') {
      if (this.props.selected !== '') {
        this.scrollToCursor(true);
      } else {
        this.scrollToCursor();
      }
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

  scrollToCursor(useSelected) {
    if (this.props.list.length > 0) {
      this.animationCallback = requestAnimationFrame(() => {
        let cursored;
        if (useSelected && this.props.selected !== '') {
          if (this.optionList.current) {
            cursored = this.optionList.current.querySelector(`.${css.selected}`);
            if (cursored) {
              this.optionList.current.scrollTop = cursored.offsetTop;
            }
          }
        } else if (this.container.current) {
          cursored = this.container.current.querySelector(`.${css.cursor}`);
          if (cursored) {
            if (
              cursored.offsetTop > ((this.optionList.current.scrollTop + this.optionList.current.offsetHeight) - 30)
            ) {
              const newScroll = cursored.offsetTop - (this.optionList.current.offsetHeight - cursored.offsetHeight);
              this.optionList.current.scrollTop = newScroll;
            } else if (cursored.offsetTop < this.optionList.current.scrollTop) {
              this.optionList.current.scrollTop = cursored.offsetTop;
            }
          }
        }
      });
    }
  }

  getClass(option) {
    // selected class..
    const selectCriteria = option.value === this.props.selected;

    return classnames(
      css.option,
      this._alignmentClass,
      { [`${css.cursor}`]: option.value === this.props.cursoredValue },
      { [`${css.selected}`]: selectCriteria },
    );
  }

  getRootClass() {
    return classnames(
      css.selectionListRoot,
      { 'sr-only': !this.props.visible },
    );
  }

  handleOptionClick(o) {
    this.props.onChoose(o.value, o.label);
    this.props.onClickItem();
  }

  getAlert() {
    if (this.props.loading) {
      return (<div className={css.selectionAlertMessage}>{this.props.loadingMessage}</div>);
    }

    if (this.props.list.length === 0) {
      return (<div className={css.selectionAlertMessage}>{this.props.emptyMessage}</div>);
    }

    return null;
  }

  renderList() {
    if (this.props.list.length === 0) {
      return (
        <li className={css.option} role="option" aria-selected="false">
          {'-'}
          <FormattedMessage id="stripes-components.selection.emptyList" />
          {'-'}
        </li>
      );
    }

    const Formatter = this.props.formatter;

    return this.props.list.map((option, i) => (
      <li
        key={`option-${i}-${option.value}`}
        role="option"
        tabIndex="-1"
        unselectable="on"
        aria-selected={option.value === this.props.selected}
        id={`option-${this.props.id}-${i}-${option.value}`}
        className={this.getClass(option)}
        onKeyDown={this.props.onFilterKeyDown}
        onClick={() => { this.handleOptionClick(option); }}
      >
        <Formatter option={option} searchTerm={this.props.searchTerm} />
      </li>
    ));
  }

  render() {
    return (
      <div
        hidden={this.props.visible ? undefined : true}
        className={this.getRootClass()}
        style={{ width: this.props.width }}
        id={`sl-container-${this.props.id}`}
        ref={this.props.rootRef}
      >
        {
          <div className={css.selectionFilterContainer}>
            <FormattedMessage
              id="stripes-components.selection.filterOptionsPlaceholder"
            >
              {([placeholder]) => (
                <FormattedMessage
                  id="stripes-components.selection.filterOptionsLabel"
                  values={{ label: this.props.label }}
                >
                  {([ariaLabel]) => (
                    <input
                      type="text"
                      aria-label={ariaLabel}
                      role="combobox"
                      aria-controls={`sl-container-${this.props.id}`}
                      aria-expanded="true"
                      placeholder={placeholder}
                      onChange={this.props.onFilter}
                      value={this.props.searchTerm}
                      className={css.selectionFilter}
                      ref={this.props.filterRef}
                      aria-owns={`sl-${this.props.id}`}
                      aria-activedescendant={this.props.activeId}
                      onKeyDown={this.props.onFilterKeyDown}
                    />
                  )}
                </FormattedMessage>
              )}
            </FormattedMessage>
          </div>
        }
        <FormattedMessage
          id="stripes-components.selection.filterOptionsLabel"
          values={{ label: this.props.label }}
        >{([ariaLabel]) => (
          <ul
            role="listbox"
            aria-label={ariaLabel}
            className={css.selectionList}
            style={{ maxHeight: this.props.maxHeight }}
            ref={this.optionList}
            id={`sl-${this.props.id}`}
          >
            {this.renderList()}
          </ul>)}
        </FormattedMessage>
        <div className={css.selectListSection} role="alert">
          {this.getAlert()}
        </div>
      </div>
    );
  }
}

SelectList.propTypes = propTypes;
SelectList.defaultProps = defaultProps;

export default SelectList;
