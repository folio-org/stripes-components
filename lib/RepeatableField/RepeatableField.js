import React, {useRef} from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import formFieldArray from '../FormFieldArray';
import Button from '../Button';
import Headline from '../Headline';
import EmptyMessage from '../EmptyMessage';
import IconButton from '../IconButton';
import { RepeatableFieldContent } from "./RepeatableFieldContent";
import css from './RepeatableField.css';
import { useFocusedIndex } from "./hooks/useFocusedIndex";
import { useIsElementFocused } from "./hooks/useIsElementFocused";


const RepeatableField = ({
  canAdd = true,
  canRemove = true,
  hasMargin = true,
  getFieldUniqueKey = (_field, index) => index,
  addLabel,
  className,
  fields,
  headLabels,
  id,
  legend,
  emptyMessage,
  onAdd,
  onRemove,
  renderField,
}) => {
  const rootRef = useRef(null);
  const showDeleteBtn = typeof onRemove === 'function';
  const fieldsLength = fields.length;
  const isSomeChildElementFocused = useIsElementFocused(rootRef);
  const focusedIndex = useFocusedIndex(fieldsLength);

  return (
    <fieldset
      ref={rootRef}
      id={id}
      data-test-repeatable-field
      className={classnames(css.repeatableField, { [css.hasMargin]: hasMargin }, className)}
    >
      {legend && (
        <Headline
          data-test-repeatable-field-legend
          tag="legend"
        >
          {legend}
        </Headline>
      )}

      {fieldsLength === 0 && emptyMessage && (
        <EmptyMessage className={css.emptyMessage} data-test-repeatable-field-empty-message>
          {emptyMessage}
        </EmptyMessage>
      )}

      {fieldsLength > 0 && (
        <ul className={css.repeatableFieldList} data-test-repeatable-field-list>
          {headLabels && (
            <li
              className={css.repeatableFieldItemLabels}
              data-test-repeatable-field-list-item-labels
            >
              <div
                className={showDeleteBtn
                  ? css.repeatableFieldItemLabelsContentWithDelete
                  : css.repeatableFieldItemLabelsContent
                }
              >
                {headLabels}
              </div>
            </li>
          )}

          {fields.map((field, index) => (
            <li
              className={css.repeatableFieldItem}
              key={getFieldUniqueKey(field, index, fields)}
              data-test-repeatable-field-list-item
            >
              <RepeatableFieldContent
                rootRef={rootRef}
                isFocused={(focusedIndex === index) && isSomeChildElementFocused}
              >
                {renderField(field, index, fields)}
              </RepeatableFieldContent>
              {
                showDeleteBtn && (
                  <div
                    className={
                      `${css.repeatableFieldRemoveItem} ${headLabels ? css.repeatableFieldRemoveUnlabeledItem : ''}`
                    }
                  >
                    <FormattedMessage id="stripes-components.deleteThisItem">
                      { ([label]) => (
                        <IconButton
                          data-test-repeatable-field-remove-item-button
                          icon="trash"
                          onClick={() => onRemove(index)}
                          size="medium"
                          disabled={!canRemove}
                          aria-label={label}
                        />
                      )}
                    </FormattedMessage>
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
  )
}

RepeatableField.propTypes = {
  addLabel: PropTypes.node,
  canAdd: PropTypes.bool,
  canRemove: PropTypes.bool,
  className: PropTypes.string,
  emptyMessage: PropTypes.node,
  fields: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,
  getFieldUniqueKey: PropTypes.func,
  hasMargin: PropTypes.bool,
  headLabels: PropTypes.node,
  id: PropTypes.string,
  legend: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string
  ]),
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func,
  renderField: PropTypes.func.isRequired,
}

export default formFieldArray(
  RepeatableField,
  ({ fields, onAdd: customOnAdd, onRemove: customOnRemove }) => {
    const onAdd = typeof customOnAdd === 'function' ? () => customOnAdd(fields) : () => fields.push({});
    // Allows for hiding the remove button by setting onRemove={false}
    const onRemove = customOnRemove === false ? undefined : index => {
      // Allow for a custom onRemove callback for redux forms
      if (typeof customOnRemove === 'function') {
        customOnRemove(fields, index);
      // Default remove callback for redux forms
      } else {
        fields.remove(index);
      }
    };

    return {
      fields,
      onAdd,
      onRemove,
    };
  }
);
