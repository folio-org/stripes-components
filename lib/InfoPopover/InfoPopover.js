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
  buttonTarget: PropTypes.string,
  content: PropTypes.node,
  contentClass: PropTypes.string,
  hideOnButtonClick: PropTypes.bool,
  iconSize: PropTypes.oneOf(['small', 'medium']),
  renderTrigger: PropTypes.func,
};

const defaultProps = {
  allowAnchorClick: false,
  buttonLabel: <FormattedMessage id="stripes-components.readMore" />,
  buttonTarget: '_blank',
  hideOnButtonClick: false,
  iconSize: 'small',
};

const InfoPopover = ({
  content,
  contentClass,
  allowAnchorClick,
  iconSize,
  buttonLabel,
  buttonHref,
  buttonTarget,
  hideOnButtonClick,
  renderTrigger,
  ...rest
}) => {
  const getContentClass = () => classnames(
    css.content,
    contentClass,
  );

  const trigger = typeof renderTrigger === 'function' ? renderTrigger :
    ({ toggle, open, ref }) => (
      <IconButton
        className={classnames(css.icon, { [css.open]: open })}
        icon="info"
        size={iconSize}
        iconSize={iconSize}
        onClick={toggle}
        ref={ref}
      />
    );

  const renderContent = ({ toggle }) => (
    <>
      <div className={getContentClass()}>{content}</div>
      {buttonHref &&
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
      }
    </>
  );

  return (
    <Popover
      className={css.root}
      renderTrigger={trigger}
      {...rest}
    >
      {renderContent}
    </Popover>
  );
};

InfoPopover.propTypes = propTypes;
InfoPopover.defaultProps = defaultProps;

export default InfoPopover;
