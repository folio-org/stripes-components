import {
  describe,
  beforeEach,
  it,
} from 'mocha';
import { converge } from '@folio/stripes-testing';
import getHookExecutionResult from '../../tests/helpers/getHookExecutionResult';
import useOverlayContainer from '../useOverlayContainer';

import { OVERLAY_CONTAINER_ID } from '../../util/consts';

const Harness = ({ children }) => (
  <div id="rootChild">
    <div id="OverlayContainer" />
    {children}
  </div>
);

const HarnessWithout = ({ children }) => (
  <div id="rootChild">
    {children}
  </div>
);

// lodash/isEqual does not work on comparing DOM nodes, so here we are....
const domNodesEqual = (current, candidate) => {
  if (current?.element?.tagName !== candidate?.element?.tagName) {
    return false;
  }

  if (current?.element?.id !== candidate?.element?.id) {
    return false;
  }

  return true;
}

describe('useOverlayContainer', () => {
  const overlayElement = () => document.getElementById(OVERLAY_CONTAINER_ID);
  let res;
  beforeEach(() => {
    res = null;
  });

  describe('withoutOverlay fallback to a child of root.', () => {
    beforeEach(async () => {
      await getHookExecutionResult(
        useOverlayContainer,
        [overlayElement()],
        HarnessWithout,
        (result) => { res = result.element },
        domNodesEqual
      );
    });

    it('should fallback to child of root element',
      () => converge(() => {
        if (res.parentNode?.id !== 'root') throw new Error(`expected child of root: ${res.id}`);
      }));
  });

  describe('successfully resolving overlay container if it exists...', () => {
    beforeEach(async () => {
      await getHookExecutionResult(
        useOverlayContainer,
        [overlayElement()],
        Harness,
        (result) => { res = result.element },
        domNodesEqual
      );
    });

    it('div#OverlayContainer in place, it should return it',
      () => converge(() => {
        if (res.id !== OVERLAY_CONTAINER_ID) throw new Error(`expected element to fallback to body: ${res.id}`);
      }));
  });
});
