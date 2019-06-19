import React, { Component } from 'react';
import PropTypes from 'prop-types';

import formFieldArray from '../FormFieldArray';
import Button from '../Button';
import Headline from '../Headline';
import IconButton from '../IconButton';
import css from './RepeatableField.css';

class RepeatableField extends Component {
  static propTypes = {
    addLabel: PropTypes.node,
    canAdd: PropTypes.bool,
    canRemove: PropTypes.bool,
    emptyMessage: PropTypes.node,
    fields: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ]).isRequired,
    id: PropTypes.string,
    legend: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string
    ]),
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func,
    renderField: PropTypes.func.isRequired,
  };

  static defaultProps = {
    canAdd: true,
    canRemove: true,
  };

  render() {
    const {
      addLabel,
      canAdd,
      canRemove,
      fields,
      id,
      legend,
      emptyMessage,
      onAdd,
      onRemove,
      renderField,
    } = this.props;

    return (
      <fieldset
        id={id}
        data-test-repeatable-field
        className={css.repeatableField}
      >
        {legend && (
          typeof legend === 'string' ? (
            <Headline
              data-test-repeatable-field-legend
              tag="legend"
            >
              {legend}
            </Headline>
          ) : (
            <div
              data-test-repeatable-field-legend
            >
              {legend}
            </div>
          )
        )}

        {fields.length === 0 && emptyMessage && (
          <p data-test-repeatable-field-empty-message>
            {emptyMessage}
          </p>
        )}

        {fields.length > 0 && (
          <ul className={css.repeatableFieldList} data-test-repeatable-field-list>
            {fields.map((field, index) => (
              <li
                className={css.repeatableFieldItem}
                key={index}
                data-test-repeatable-field-list-item
              >
                <div className={css.repeatableFieldItemContent}>
                  {renderField(field, index, fields)}
                </div>
                {
                  typeof onRemove === 'function' && (
                    <div className={css.repeatableFieldRemoveItem}>
                      <IconButton
                        data-test-repeatable-field-remove-item-button
                        icon="trash"
                        onClick={() => onRemove(index)}
                        size="medium"
                        disabled={!canRemove}
                      />
                    </div>
                  )
                }
              </li>
            ))}
          </ul>
        )}
        {addLabel && (
          <Button
            data-test-repeatable-field-add-item-button
            onClick={onAdd}
            type="button"
            disabled={!canAdd}
            id={id && `${id}-add-button`}
          >
            {addLabel}
          </Button>
        )}
      </fieldset>
    );
  }
}

export default formFieldArray(
  RepeatableField,
  ({ fields }) => ({
    fields,
    onAdd: () => fields.push({}),
    onRemove: (index) => fields.remove(index)
  })
);
