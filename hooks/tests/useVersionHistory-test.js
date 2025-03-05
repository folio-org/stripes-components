import { useState } from 'react';
import {
  describe,
  beforeEach,
  it,
} from 'mocha';
import {
  Button as ButtonInteractor,
  converge,
} from '@folio/stripes-testing';
import isEqual from 'lodash/isEqual';

import Button from '../../lib/Button';
import { getHookExecutionHarness } from '../../tests/helpers/getHookExecutionResult';
import useVersionHistory from '../useVersionHistory';

const mockData = [{
  'eventId': 'b5028383-d4ca-4ae2-b321-8f5f43971485',
  'entityId': '5aa67b42-6160-4f37-a662-3503159a240a',
  'eventTs': 1741016911081,
  'eventDate': '2025-03-03T15:48:31.081+00:00',
  'action': 'UPDATE',
  'userId': 'f8d8e8e3-3128-57c7-a137-80a237f62c2f',
  'diff': {
    'fieldChanges': [
      {
        'changeType': 'ADDED',
        'fieldName': 'catalogedDate',
        'fullPath': 'catalogedDate',
        'newValue': '2025-03-17'
      }
    ],
    'collectionChanges': [],
  }
}];

const mockData2 = [{
  'eventId': 'b5028383-d4ca-4ae2-b321-8f5f43971485',
  'entityId': '5aa67b42-6160-4f37-a662-3503159a240a',
  'eventTs': 103050304,
  'eventDate': '2025-03-03T15:48:31.081+00:00',
  'action': 'CHANGE',
  'userId': 'f8d8e8e3-3128-57c7-a137-80a237f62c2f',
  'diff': {
    'fieldChanges': [
      {
        'changeType': 'REMOVED',
        'fieldName': 'catalogedDate',
        'fullPath': 'catalogedDate',
        'newValue': ''
      }
    ],
    'collectionChanges': [],
  }
}];

const mockTotalRecords = 5;
const mockVersionsFormatter = (diffArray) => {
  return diffArray
    .map(({ eventDate, eventTs, userId, eventId, diff }) => ({
      eventDate,
      source: userId,
      userName: 'John, Doe',
      fieldChanges: diff.fieldChanges || [],
      eventId,
      eventTs,
    }));
};

const expectedRes = {
  versions: [{
    eventDate: '2025-03-03T15:48:31.081+00:00',
    source: 'f8d8e8e3-3128-57c7-a137-80a237f62c2f',
    userName: 'John, Doe',
    fieldChanges: [
      {
        'changeType': 'ADDED',
        'fieldName': 'catalogedDate',
        'fullPath': 'catalogedDate',
        'newValue': '2025-03-17'
      }
    ],
    eventId: 'b5028383-d4ca-4ae2-b321-8f5f43971485',
    eventTs: 1741016911081,
  }],
  isLoadedMoreVisible: true,
};

const expectedRes2 = {
  versions: [{
    eventDate: '2025-03-03T15:48:31.081+00:00',
    source: 'f8d8e8e3-3128-57c7-a137-80a237f62c2f',
    userName: 'John, Doe',
    fieldChanges: [
      {
        'changeType': 'REMOVED',
        'fieldName': 'catalogedDate',
        'fullPath': 'catalogedDate',
        'newValue': ''
      }
    ],
    eventId: 'b5028383-d4ca-4ae2-b321-8f5f43971485',
    eventTs: 103050304,
  }],
  isLoadedMoreVisible: true,
};


const Harness = ({ children }) => {
  const [renderChild, setRenderChild] = useState(false);
  const [data, setData] = useState(mockData);
  return (
    <>
      <Button onClick={() => setRenderChild(visible => !visible)}>Toggle</Button>
      <Button onClick={() => setData(mockData2)}>Change data</Button>
      {renderChild && children({
        data,
        totalRecords: mockTotalRecords,
        versionsFormatter: mockVersionsFormatter,
      })}
    </>
  )
};

describe('useVersionHistory', () => {
  describe('mounting / unmounting.', () => {
    let result;
    beforeEach(async () => {
      await getHookExecutionHarness(
        useVersionHistory,
        {},
        Harness,
        (res) => { result = res; },
        isEqual,
        true
      );
    });

    it('result contains versions', () => {
      converge(() => {
        if (!isEqual(result?.versions, expectedRes)) {
          throw new Error('expected array of versions');
        }
      });
    });

    describe('changing data', () => {
      beforeEach(async () => {
        await ButtonInteractor('Change data').click();
      });

      it('updates result data', () => {
        converge(() => {
          if (!isEqual(result?.versions, expectedRes2)) {
            throw new Error('expected array of versions to change');
          }
        });
      });
    });

    describe('unmounting', () => {
      beforeEach(async () => {
        await ButtonInteractor('Toggle').click();
      });

      it('versions is emptied', () => {
        converge(() => {
          if (result?.versions?.length !== 0) {
            throw new Error('expected array of versions to be empty');
          }
        });
      });
    });
  });
});
