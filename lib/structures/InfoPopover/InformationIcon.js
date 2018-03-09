/**
 * InformationIcon
 */

import React from 'react';
import PropTypes from 'prop-types';
import Popover from '../../Popover';
import Button from '../../Button';
import IconButton from '../../IconButton';
import css from './InformationIcon.css';

const propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  buttonLabel: PropTypes.string,
  buttonHref: PropTypes.string,
  buttonTarget: PropTypes.string,
};

const defaultProps = {
  buttonLabel: 'Read more',
  buttonTarget: '_blank',
};

const InformationIcon = ({ content, buttonLabel, buttonHref, buttonTarget }) => {
  const onClick = () => {
    window.open(buttonHref, buttonTarget);
  };
  return (
    <Popover activeClass={css.activeClass}>
      <IconButton
        className={css.icon}
        data-role="target"
        icon="info"
        size="small"
        iconSize="small"
      />
      <div data-role="popover" className={css.wrap}>
        <div className={css.content}>{content}</div>
        <Button
          onClick={onClick}
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
};

InformationIcon.propTypes = propTypes;
InformationIcon.defaultProps = defaultProps;

export default InformationIcon;
