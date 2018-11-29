/**
 * InfoPopover
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import Popover from '../Popover';
import Button from '../Button';
import IconButton from '../IconButton';

import css from './InfoPopover.css';

const propTypes = {
  allowAnchorClick: PropTypes.bool,
  buttonHref: PropTypes.string,
  buttonLabel: PropTypes.node,
  buttonTarget: PropTypes.string,
  content: PropTypes.node,
  contentClass: PropTypes.string,
  iconSize: PropTypes.oneOf(['small', 'medium']),
};

const defaultProps = {
  allowAnchorClick: false,
  buttonLabel: <FormattedMessage id="stripes-components.readMore" />,
  buttonTarget: '_blank',
  iconSize: 'small',
};

const InfoPopover = ({ content, contentClass, allowAnchorClick, iconSize, buttonLabel, buttonHref, buttonTarget }) => {
  const getContentClass = () => classNames(
    css.content,
    contentClass,
  );

  return (
    <Popover activeClass={css.activeClass}>
      <IconButton
        className={css.icon}
        data-role="target"
        icon="info"
        size={iconSize}
        iconSize={iconSize}
      />
      <div data-role="popover" className={css.wrap}>
        <div className={getContentClass()}>{content}</div>
        {buttonHref &&
          <Button
            allowAnchorClick={allowAnchorClick}
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
};

InfoPopover.propTypes = propTypes;
InfoPopover.defaultProps = defaultProps;

export default InfoPopover;
