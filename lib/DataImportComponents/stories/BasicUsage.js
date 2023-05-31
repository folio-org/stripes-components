/**
 * Data import job card Example
 */

import React, { useState } from 'react';
import { Job } from '../Job';

const JOB_STATUSES = {
  RUNNING: 'RUNNING',
};

const data =
  {
    id: '469eba83-41d1-4161-bd1a-0f46d5554c6a',
    hrId: 182982989,
    subordinationType: 'PARENT_SINGLE',
    jobProfileInfo: { name: 'Main bib jobs' },
    fileName: 'import_1.mrc',
    sourcePath: 'import_1.mrc',
    runBy: {
      firstName: 'Mark',
      lastName: 'Curie',
    },
    progress: {
      current: 290,
      total: 500,
    },
    startedDate: '2018-11-22T12:00:31.000',
    uiStatus: JOB_STATUSES.RUNNING,
    status: 'PROCESSING_FINISHED',
  };

export default () => {
  return (
    <div style={{ width: '33%'}}>
      <Job
        job={data}
      />
    </div>
  );
};
