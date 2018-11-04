import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import Icon from '../Icon';
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
        <Button
          aria-labelledby={`${labelId} ${controlLabelId}`}
          aria-describedby={descriptionId}
          size="small"
          buttonStyle="plain slim"
          {...removeButtonProps}
        >
          <Icon icon="closeX" />
        </Button>
      </div>
    </li>
  );
};

ValueChip.propTypes = {
  children: PropTypes.object,
  controlLabelId: PropTypes.string,
  descriptionId: PropTypes.string,
  id: PropTypes.string,
  removeButtonProps: PropTypes.object,
};

export default ValueChip;
