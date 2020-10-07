/**
 * InfoPopover
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';

import Popover, { PopoverConsumer } from '../Popover/LegacyPopover/LagacyPopover';
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
  hideOnButtonClick: PropTypes.bool,
  iconSize: PropTypes.oneOf(['small', 'medium']),
};

const defaultProps = {
  allowAnchorClick: false,
  buttonLabel: <FormattedMessage id="stripes-components.readMore" />,
  buttonTarget: '_blank',
  hideOnButtonClick: false,
  iconSize: 'small',
};

const InfoPopover = (props) => {
  const {
    content,
    contentClass,
    allowAnchorClick,
    iconSize,
    buttonLabel,
    buttonHref,
    buttonTarget,
    hideOnButtonClick,
  } = props;
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
          <PopoverConsumer>
            {({ toggle }) => (
              <Button
                allowAnchorClick={allowAnchorClick}
                onClick={hideOnButtonClick ? toggle : noop}
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
            )}
          </PopoverConsumer>
        }
      </div>
    </Popover>
  );
};

InfoPopover.propTypes = propTypes;
InfoPopover.defaultProps = defaultProps;

export default InfoPopover;
