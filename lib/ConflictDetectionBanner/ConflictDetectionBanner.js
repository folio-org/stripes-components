import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import MessageBanner from '../MessageBanner';
import TextLink from '../TextLink';
import Icon from '../Icon';
import css from './ConflictDetectionBanner.css';

const ConflictDetectionBanner = ({
  latestVersionLink,
  conflictDetectionBannerRef,
  focusConflictDetectionBanner,
}) => {
  const intl = useIntl();

  useEffect(() => {
    focusConflictDetectionBanner();
  }, [focusConflictDetectionBanner]);

  const errorMessage = intl.formatMessage({ id: 'stripes-components.optimisticLocking.saveError' });
  const latestVersionLabel = intl.formatMessage({ id: 'stripes-components.optimisticLocking.latestVersion' });

  return (
    <MessageBanner
      type="error"
      className={css.container}
      ref={conflictDetectionBannerRef}
      tabIndex="-1"
    >
      {errorMessage}
      <TextLink
        target="_blank"
        rel="noopener noreferrer"
        to={latestVersionLink}
        className={css.link}
      >
        <Icon
          icon="external-link"
          iconPosition="end"
          iconRootClass={css.externalLink}
        >
          <strong>{latestVersionLabel}</strong>
        </Icon>
      </TextLink>
    </MessageBanner>
  );
};

ConflictDetectionBanner.propTypes = {
  conflictDetectionBannerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  focusConflictDetectionBanner: PropTypes.func.isRequired,
  latestVersionLink: PropTypes.string.isRequired,
};

export default ConflictDetectionBanner;
