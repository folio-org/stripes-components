/**
 * InformationIcon
 */

import React from 'react';
import PropTypes from 'prop-types';
import Popover from '../Popover';
import Button from '../Button';
import IconButton from '../IconButton';
import css from './InformationIcon.css';

const propTypes = {
  content: PropTypes.string,
};

const InformationIcon = ({ content, buttonLabel }) => (
  <Popover>
    <IconButton
      data-role="target"
      icon="info"
      size="small"
      iconSize="small"
    />
    <div data-role="popover" className={css.wrap}>
      <div className={css.content}>{content}</div>
      <Button
        buttonStyle="primary"
        fullWidth
        paddingSide0
        marginBottom0
        buttonClass={css.button}
      >
        {buttonLabel}
      </Button>
    </div>
  </Popover>
);

InformationIcon.propTypes = propTypes;

export default InformationIcon;
