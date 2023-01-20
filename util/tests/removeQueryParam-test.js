import { expect } from 'chai';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';
import removeQueryParam from '../removeQueryParam';

describe('Remove param', () => {
  let harness = {};
  const historyPush = sinon.spy();
  beforeEach(() => {
    harness = {
      props: {
        location: {
          search: '?term=mark&item=walrus',
          pathname: 'test/path'
        },
        history: {
          push: historyPush,
        }
      }
    };
  });

  it('calls history.push with expected output', () => {
    removeQueryParam.call(harness, 'item');
    expect(historyPush.calledWith('test/path?term=mark')).to.equal(true);
  });
});
