import React from 'react';
import PropTypes from 'prop-types';
import ValueNode from './ValueNode';
import omitProps from '../../util/omitProps';
import classnames from 'classnames';
import css from './Selection.css';

const propTypes = {
  valueList: PropTypes.array,
  onRemove: PropTypes.func,
  controlRef: PropTypes.func,
  readOnly: PropTypes.bool,
  onMouseDown: PropTypes.func,
  onFilterKeyDown: PropTypes.func,
  selectedItemsCursorValue: PropTypes.string,
  id: PropTypes.string,
  listVisible: PropTypes.bool,
}

class MultiSelector extends React.Component {
  constructor(props) {
    super(props);

    this.renderSelected = this.renderSelected.bind(this);
    this.getValueNodeClasses = this.getValueNodeClasses.bind(this);
  }

  getValueNodeClasses(v) {
    return classnames(
      css.ValueNodeContainer,
      { [`${css.ValueNodeSelected}`]: v.value === this.props.selectedItemsCursorValue },
    );
  }

  renderSelected() {
    const vnProps = omitProps(this.props, ['valueList', 'controlRef']);
    return this.props.valueList.map( (v) => {
      return (
        <ValueNode 
          key={`selected-${v.value}`}
          value={v.value}
          label={v.label}
          {...vnProps}
          className={this.getValueNodeClasses(v)}
        />
      );
    });
  }

  render() {
    return (
    <div 
      className={css.SelectionMultiContainer}
      role="button"
      ref={this.props.controlRef}
      onClick={this.props.onMouseDown}
    >
      <ul role="listbox" id={`${this.props.id}-selected-items-list`} className={css.SelectionMultiSelected}>
        {this.props.valueList.length > 0 && this.renderSelected()}
        <li className={css.SelectionMultiInputContainer}>
          <input 
            role="listbox"
            placeholder={this.props.valueList.length === 0 ? this.props.placeholder : ''}
            onKeyDown={this.props.onFilterKeyDown}
            onChange={this.props.onFilter}
            value={this.props.searchTerm}
            className={css.SelectionFilterInline}
            type="text"
            id={this.props.id}
            aria-controls={`sl-${this.props.id}`}
            aria-haspopup="true"
            aria-expanded={this.props.listVisible}
            aria-activedescendant={this.props.activeId}
            ref={this.props.inputRef}
          />
        </li>
      </ul>
    </div>
    );
  }
}

export default MultiSelector;
