import React, { Component } from 'react';
import PropTypes from 'prop-types';

import reduxFormFieldArray from '../ReduxFormFieldArray';
import Button from '../Button';
import Headline from '../Headline';
import IconButton from '../IconButton';
import css from './RepeatableField.css';

class RepeatableField extends Component {
  static propTypes = {
    addLabel: PropTypes.node,
    emptyMessage: PropTypes.node,
    fields: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ]).isRequired,
    legend: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string
    ]),
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    renderField: PropTypes.func.isRequired
  };

  render() {
    const {
      addLabel,
      fields,
      legend,
      emptyMessage,
      onAdd,
      onRemove,
      renderField
    } = this.props;

    return (
      <fieldset
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
          <ul className={css.repeatableFieldList}>
            {fields.map((field, index) => (
              <li
                className={css.repeatableFieldItem}
                key={index}
              >
                {renderField(field, index, fields)}
                <div
                  className={css.repeatableFieldRemoveItem}
                >
                  <IconButton
                    data-test-repeatable-field-remove-item-button
                    icon="trashBin"
                    onClick={() => onRemove(index)}
                    size="small"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
        {addLabel && (
          <Button
            data-test-repeatable-field-add-item-button
            onClick={onAdd}
            type="button"
          >
            {addLabel}
          </Button>
        )}
      </fieldset>
    );
  }
}

export default reduxFormFieldArray(
  RepeatableField,
  ({ fields }) => ({
    fields,
    onAdd: () => fields.push({}),
    onRemove: (index) => fields.remove(index)
  })
);
