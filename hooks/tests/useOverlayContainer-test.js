import {
  describe,
  beforeEach,
  it,
} from 'mocha';
import { converge } from '@folio/stripes-testing';
import { getHookExecutionHarness } from '../../tests/helpers/getHookExecutionResult';
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

// We need to compare the `element` field of the result to discern difference on the re-render.
const areDomNodesEqual = (current, candidate) => {
  return current?.element === candidate?.element;
}

describe('useOverlayContainer', () => {
  const overlayElement = () => document.getElementById(OVERLAY_CONTAINER_ID);
  let res;
  beforeEach(() => {
    res = null;
  });

  describe('withoutOverlay fallback to a child of root.', () => {
    beforeEach(async () => {
      await getHookExecutionHarness(
        useOverlayContainer,
        [overlayElement()],
        HarnessWithout,
        (result) => { res = result.element },
        areDomNodesEqual
      );
    });

    it('should fallback to child of root element',
      () => converge(() => {
        if (res.parentNode?.id !== 'root') throw new Error(`expected child of root: ${res.id}`);
      }));
  });

  describe('successfully resolving overlay container if it exists...', () => {
    beforeEach(async () => {
      await getHookExecutionHarness(
        useOverlayContainer,
        [overlayElement()],
        Harness,
        (result) => { res = result.element },
        areDomNodesEqual
      );
    });

    it('div#OverlayContainer in place, it should return it',
      () => converge(() => {
        if (res.id !== OVERLAY_CONTAINER_ID) throw new Error(`expected element to fallback to body: ${res.id}`);
      }));
  });

  describe('successfully initial null result...', () => {
    beforeEach(async () => {
      await getHookExecutionHarness(
        useOverlayContainer,
        [null],
        Harness,
        (result) => { res = result.element },
        areDomNodesEqual
      );
    });

    it('div#OverlayContainer in place, it should return it',
      () => converge(() => {
        if (res.id !== OVERLAY_CONTAINER_ID) throw new Error(`expected element to fallback to body: ${res.id}`);
      }));
  });

  describe('successfully initial result...', () => {
    beforeEach(async () => {
      await getHookExecutionHarness(
        useOverlayContainer,
        ['true'],
        Harness,
        (result) => { res = result.element },
        areDomNodesEqual
      );
    });

    it('div#OverlayContainer in place, it should return it',
      () => converge(() => {
        if (res !== 'true') throw new Error('should just return truthy value');
      }));
  });

  describe('falsy initial result...', () => {
    beforeEach(async () => {
      res = await getHookExecutionHarness(
        useOverlayContainer,
        [false],
        Harness,
        (result) => { res = result.element },
        areDomNodesEqual
      );
      res.refresh();
    });

    it('div#OverlayContainer in place, it should return it',
      () => converge(() => {
        if (res.element !== false) throw new Error('should just return false value');
      }));
  });

  describe('refresh', () => {
    beforeEach(async () => {
      res = await getHookExecutionHarness(
        useOverlayContainer,
        [null],
        Harness,
        (result) => { res = result },
        areDomNodesEqual
      );
      res.refresh();
    });

    it('div#OverlayContainer in place, it should return it',
      () => converge(() => {
        if (res.element.id !== OVERLAY_CONTAINER_ID) throw new Error(`expected element to fallback to body: ${res.id}`);
      }));
  });
});
