import { expect } from 'chai';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';
import transitionToParams from '../transitionToParams';

describe('Transition to params', () => {
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
    transitionToParams.call(harness, { term: 'arnold' });
    expect(historyPush.calledWith('test/path?item=walrus&term=arnold')).to.equal(true);
  });
});
