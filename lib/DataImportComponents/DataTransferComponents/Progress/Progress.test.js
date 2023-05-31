import React from 'react';

import {
  screen, render,
} from '@testing-library/react';

import '../../test/jest/__mock__';

import { Progress } from './Progress';

describe('Progress', () => {
  const currentValue = 10;
  const totalValue = 100;
  const renderProgress = (
    currentProgress, totalProgress, progressInfo = undefined, message = null
  ) => render(
    <Progress
      current={currentProgress}
      total={totalProgress}
      progressInfoType={progressInfo}
      payload={{ message }}
    />
  );

  it('should display progress component', () => {
    renderProgress(currentValue, totalValue);

    expect(screen.getByTestId('progress-bar')).toBeVisible();
  });

  it('should display correct current progress position', () => {
    renderProgress(currentValue, totalValue);

    expect(screen.getByTestId('progress-current')).toHaveAttribute('style', `width: ${totalValue / currentValue}%;`);
  });

  it('should display correct progress info', () => {
    renderProgress(currentValue, totalValue);

    expect(screen.getByText(`${totalValue / currentValue}%`)).toBeVisible();
  });

  describe('rendering Progress with "messagedPercentage" progress info type', () => {
    it('should display correct progress info', () => {
      const testMessage = 'TestMessage';
      const progressInfoText = 'messagedPercentage';

      renderProgress(currentValue, totalValue, progressInfoText, testMessage);

      expect(screen.getByTestId('progress-bar')).toBeVisible();
      expect(screen.getByText(`${testMessage} ${totalValue / currentValue}%`)).toBeVisible();
    });
  });

  describe('rendering Progress with "messagedPercentage" progress and full progress', () => {
    it('should display preloader', () => {
      const testMessage = 'TestMessage';
      const progressInfoText = 'messagedPercentage';

      renderProgress(totalValue, totalValue, progressInfoText, testMessage);

      expect(screen.getByTestId('preloader')).toBeVisible();
    });
  });

  describe('rendering Progress with "none" progress', () => {
    it('should not display progress message and percentages', () => {
      const progressInfoText = 'none';

      renderProgress(totalValue, totalValue, progressInfoText);

      expect(screen.getByTestId('progress-info')).not.toHaveTextContent();
    });
  });
});
