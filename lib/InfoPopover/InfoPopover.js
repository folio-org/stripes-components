/**
 * InfoPopover
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';
import Popover from '../Popover';
import Button from '../Button';
import IconButton from '../IconButton';
import css from './InfoPopover.css';

const propTypes = {
  allowAnchorClick: PropTypes.bool,
  buttonHref: PropTypes.string,
  buttonLabel: PropTypes.node,
  buttonProps: PropTypes.object,
  buttonTarget: PropTypes.string,
  content: PropTypes.node,
  contentClass: PropTypes.string,
  hideOnButtonClick: PropTypes.bool,
  iconSize: PropTypes.oneOf(['small', 'medium']),
  popperProps: PropTypes.object,
  renderTrigger: PropTypes.func,
};

const defaultProps = {
  allowAnchorClick: false,
  buttonLabel: <FormattedMessage id="stripes-components.readMore" />,
  buttonTarget: '_blank',
  hideOnButtonClick: false,
  iconSize: 'small',
  popperProps: {},
};

const InfoPopover = ({
  content,
  contentClass,
  allowAnchorClick,
  iconSize,
  buttonLabel,
  buttonHref,
  buttonProps,
  buttonTarget,
  hideOnButtonClick,
  renderTrigger,
  popperProps,
  ...rest
}) => {
  const getContentClass = () => classnames(
    css.content,
    contentClass,
  );

  const trigger = typeof renderTrigger === 'function' ? renderTrigger :
    ({ toggle, open, ref }) => (
      <IconButton
        data-test-info-popover-trigger
        className={classnames(css.icon, { [css.open]: open })}
        icon="info"
        size={iconSize}
        iconSize={iconSize}
        onClick={toggle}
        ref={ref}
        {...buttonProps}
      />
    );

  const renderContent = ({ toggle }) => (/* eslint-disable-line react/prop-types */
    <>
      <div data-test-info-popover-content className={getContentClass()}>{content}</div>
      {buttonHref &&
        <Button
          data-test-info-popover-button
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
      }
    </>
  );

  return (
    <Popover
      data-test-info-popover
      className={css.root}
      renderTrigger={trigger}
      popperProps={{
        portal: document.getElementById('OverlayContainer'),
        ...popperProps
      }}
      {...rest}
    >
      {renderContent}
    </Popover>
  );
};

InfoPopover.propTypes = propTypes;
InfoPopover.defaultProps = defaultProps;

export default InfoPopover;
