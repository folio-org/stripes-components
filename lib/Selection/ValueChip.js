import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@folio/stripes-components/lib/IconButton';
import css from './MultiSelect.css';
import { propTypes } from '../Button';

const ValueChip = ({children, id, removeButtonProps, controlLabelId, descriptionId}) => {
  const labelId = `${id}_multiselect_selected_label`;
  const buttonId = `${id}_remove_action`;
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
        icon="closeX"
        size="small"
        {...removeButtonProps}
      />
    </div>
  </li>
)};

ValueChip.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  removeButtonProps: PropTypes.object,
};

export default ValueChip;
