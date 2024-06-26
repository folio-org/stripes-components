import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '../IconButton';
import css from './MultiSelect.css';

const ValueChip = ({
  children,
  disabled,
  id,
  getRemoveButtonProps,
  controlLabelId,
  descriptionId,
  item,
  index,
}) => (
  <li key={id} className={css.valueChipRoot} id={`${id}_multiselect_selected`}>
    <div className={css.valueChipGroup}>
      <div className={css.valueChipValue} id={`${id}_multiselect_selected_label`}>
        {children}
      </div>
      <IconButton
        aria-labelledby={`${id}_multiselect_selected_label ${controlLabelId}`}
        aria-describedby={descriptionId}
        disabled={disabled}
        icon="times"
        size="small"
        iconSize="small"
        style={{ padding: 0 }} // set padding: 0 for odd spacing behavior in IE.
        {...getRemoveButtonProps({ item, index })}
      />
    </div>
  </li>
);

ValueChip.propTypes = {
  children: PropTypes.node,
  controlLabelId: PropTypes.string,
  descriptionId: PropTypes.string,
  disabled: PropTypes.bool,
  getRemoveButtonProps: PropTypes.func,
  id: PropTypes.string,
  index: PropTypes.number,
  item: PropTypes.object
};

export default ValueChip;
