import {
  describe,
  it,
} from 'mocha';
import { expect } from 'chai';

import getHookExecutionResult from '../../tests/helpers/getHookExecutionResult';
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

describe('useVersionHistory', () => {
  it('should return correct versions', () => {
    getHookExecutionResult(useVersionHistory, {
      data: mockData,
      totalRecords: mockTotalRecords,
      versionsFormatter: mockVersionsFormatter,
    }).then(res => {
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

      expect(res).to.equal(expectedRes);
    });
  });
});
