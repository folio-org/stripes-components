/**
 * InfoPopover
 */

import React from 'react';
import PropTypes from 'prop-types';
import Popover from '../Popover';
import Button from '../Button';
import IconButton from '../IconButton';
import css from './InfoPopover.css';

const propTypes = {
  buttonHref: PropTypes.string,
  buttonLabel: PropTypes.string,
  buttonTarget: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

const defaultProps = {
  buttonLabel: 'Read more',
  buttonTarget: '_blank',
};

const InfoPopover = ({ content, buttonLabel, buttonHref, buttonTarget }) => (
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
      { buttonHref &&
        <Button
          href={buttonHref}
          target={buttonTarget}
          buttonStyle="primary"
          fullWidth
          paddingSide0
          marginBottom0
          buttonClass={css.button}
        >
          {buttonLabel}
        </Button>
      }
    </div>
  </Popover>
);

InfoPopover.propTypes = propTypes;
InfoPopover.defaultProps = defaultProps;

export default InfoPopover;
