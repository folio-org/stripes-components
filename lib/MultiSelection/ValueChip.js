import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '../IconButton';
import css from './MultiSelect.css';

const ValueChip = ({ children, id, removeButtonProps, controlLabelId, descriptionId }) => {
  const labelId = `${id}_multiselect_selected_label`;
  // const buttonId = `${id}_remove_action`;
  const liId = `${id}_multiselect_selected`;
  return (
    <li key={id} className={css.valueChipRoot} id={liId}>
      <div className={css.valueChipGroup}>
        <div className={css.valueChipValue} id={labelId}>
          {children}
        </div>
        <IconButton
          aria-labelledby={`${labelId} ${controlLabelId}`}
          aria-describedby={descriptionId}
          icon="times"
          size="small"
          iconSize="small"
          style={{ padding: 0 }} // set padding: 0 for odd spacing behavior in IE.
          {...removeButtonProps}
        />
      </div>
    </li>
  );
};

ValueChip.propTypes = {
  children: PropTypes.node,
  controlLabelId: PropTypes.string,
  descriptionId: PropTypes.string,
  id: PropTypes.string,
  removeButtonProps: PropTypes.object,
};

export default ValueChip;
