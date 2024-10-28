import React, { useRef, useEffect } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import formFieldArray from '../FormFieldArray';
import Button from '../Button';
import Headline from '../Headline';
import EmptyMessage from '../EmptyMessage';
import IconButton from '../IconButton';
import { RepeatableFieldContent } from './RepeatableFieldContent';
import css from './RepeatableField.css';
import { useFocusedIndex } from './hooks/useFocusedIndex';
import { useIsElementFocused } from './hooks/useIsElementFocused';
import { getFirstFocusable } from '../../util/getFocusableElements';

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

  // use mutation observers to handle focus-management since we only have internal state.
  useEffect(() => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type !== 'childList') return;

        const addedNode = mutation.addedNodes?.[0];
        const removedNode = mutation.removedNodes?.[0];
        let rowElem;
        // Handle added node
        if (rootRef.current.matches(':focus-within')) {
          if (addedNode && addedNode.matches(`.${css.repeatableFieldItem}`)) {
            rowElem = getFirstFocusable(addedNode);
            rowElem?.focus();
          }
        }

        // Handle removed node
        if (removedNode &&
          mutation.previousSibling &&
          mutation.previousSibling.matches(`.${css.repeatableFieldItem}`)) {
          rowElem = getFirstFocusable(mutation.previousSibling);
          rowElem?.focus();
        }
      });
    });

    if (rootRef.current) {
    // observe for item additions/removals from list.
      observer.observe(rootRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [])

  const hasToBeFocused = (index) => isSomeChildElementFocused && focusedIndex === index;

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
                isFocused={hasToBeFocused(index)}
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
