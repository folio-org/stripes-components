import { JOB_STATUSES } from '../utils/constants';

export const jobMetaTypes = {
  [JOB_STATUSES.RUNNING]: job => ({
    showProgress: true,
    showPreview: false,
    date: job.startedDate,
    dateLabel: 'began',
  }),
};
