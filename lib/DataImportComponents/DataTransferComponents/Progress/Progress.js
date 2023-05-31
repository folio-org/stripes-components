import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { calculatePercentage } from '../utils/calculatePercentage';
import { Preloader } from '../Preloader';

import css from './Progress.css';

const progressInfoFormatters = {
  percentage: (current, total) => `${calculatePercentage(current, total)}%`,
  messagedPercentage: (current, total, payload) => {
    const { message } = payload;
    const percentage = calculatePercentage(current, total);
    const isCompleted = percentage === 100;

    return isCompleted
      ? (<Preloader />)
      : (
        <>
          {message}
          {` ${percentage}%`}
        </>
      );
  },
};

export const Progress = memo(({
  current,
  total,
  progressInfoType = 'percentage',
  payload = {},
  progressClassName = css.progress,
  progressWrapperClassName = css.progressWrapper,
  progressInfoClassName = css.progressInfo,
  progressCurrentClassName = css.progressCurrent,
}) => {
  const progressValue = calculatePercentage(current, total);
  const progressInfo = progressInfoFormatters[progressInfoType]?.(current, total, payload);

  return (
    <div
      className={progressClassName}
      data-test-progress-bar
      data-testid="progress-bar"
    >
      <div className={progressWrapperClassName}>
        <div
          className={progressCurrentClassName}
          style={{ width: `${progressValue}%` }}
          data-testid="progress-current"
        />
      </div>
      <div
        data-testid="progress-info"
        className={progressInfoClassName}
      >
        {progressInfo}
      </div>
    </div>
  );
});

Progress.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  progressInfoType: PropTypes.string,
  payload: PropTypes.object,
  progressWrapperClassName: PropTypes.string,
  progressClassName: PropTypes.string,
  progressCurrentClassName: PropTypes.string,
  progressInfoClassName: PropTypes.string,
};
