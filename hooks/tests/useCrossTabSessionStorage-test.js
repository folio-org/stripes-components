import {
  describe,
  beforeEach,
  afterEach,
  it,
} from 'mocha';
import { converge } from '@folio/stripes-testing';
import { getHookExecutionHarness } from '../../tests/helpers/getHookExecutionResult';
import { mount } from '../../tests/helpers';
import useCrossTabSessionStorage, {
  getValueKey,
  getRegistryKey,
  STALE_THRESHOLD_MS,
} from '../useCrossTabSessionStorage';

const PREFIX = '@folio/stripes-components::crossTabSession::';

const clearAllSyncedStorage = () => {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k));
};

const dispatchStorageEvent = (key, newValue, oldValue = null) => {
  window.dispatchEvent(new StorageEvent('storage', {
    key,
    newValue,
    oldValue,
    storageArea: window.localStorage,
  }));
};

describe('useCrossTabSessionStorage', () => {
  let latest;
  const captureResult = (result) => { latest = result; };

  afterEach(async () => {
    await mount(<div />);
    clearAllSyncedStorage();
  });

  describe('basic get/set', () => {
    const key = 'test-key-basic';

    beforeEach(async () => {
      latest = await getHookExecutionHarness(
        useCrossTabSessionStorage,
        [key, false],
        undefined,
        captureResult,
      );
    });

    it('returns the initial value', () => converge(() => {
      if (latest?.[0] !== false) throw new Error('expected initial value to be false');
    }));

    it('persists an update to localStorage and local state', () => {
      latest[1](true);
      return converge(() => {
        if (latest?.[0] !== true) throw new Error('expected value to update to true');
        if (localStorage.getItem(getValueKey(key)) !== 'true') throw new Error('expected localStorage to be updated');
      });
    });

    it('supports the updater-function form', () => {
      latest[1]((prev) => !prev);
      return converge(() => {
        if (latest?.[0] !== true) throw new Error('expected value to toggle to true');
      });
    });
  });

  describe('cross-tab sync via storage event', () => {
    const key = 'test-key-cross-tab';

    beforeEach(async () => {
      latest = await getHookExecutionHarness(
        useCrossTabSessionStorage,
        [key, false],
        undefined,
        captureResult,
      );
    });

    it('updates local state when another tab writes the value', () => {
      localStorage.setItem(getValueKey(key), 'true');
      dispatchStorageEvent(getValueKey(key), 'true', 'false');

      return converge(() => {
        if (latest?.[0] !== true) throw new Error('expected value to sync from another tab');
      });
    });
  });

  describe('new session ignores a stale value left by a dead tab', () => {
    const key = 'test-key-stale';

    beforeEach(async () => {
      localStorage.setItem(getValueKey(key), JSON.stringify(true));
      localStorage.setItem(getRegistryKey(key), JSON.stringify({
        'stale-tab': Date.now() - (STALE_THRESHOLD_MS + 1000),
      }));

      latest = await getHookExecutionHarness(
        useCrossTabSessionStorage,
        [key, false],
        undefined,
        captureResult,
      );
    });

    it('discards the stale value and returns the initial value', () => converge(() => {
      if (latest?.[0] !== false) throw new Error('expected stale value to be ignored');
    }));

    it('clears the stale value from localStorage', () => converge(() => {
      if (localStorage.getItem(getValueKey(key)) !== null) throw new Error('expected stale value to be cleared');
    }));
  });

  describe('an ongoing session inherits the live value from another tab', () => {
    const key = 'test-key-live';

    beforeEach(async () => {
      localStorage.setItem(getValueKey(key), JSON.stringify(true));
      localStorage.setItem(getRegistryKey(key), JSON.stringify({
        'other-live-tab': Date.now(),
      }));

      latest = await getHookExecutionHarness(
        useCrossTabSessionStorage,
        [key, false],
        undefined,
        captureResult,
      );
    });

    it('inherits the value from the still-open tab', () => converge(() => {
      if (latest?.[0] !== true) throw new Error('expected live value to be inherited');
    }));
  });

  describe('last tab closing clears the shared value', () => {
    const key = 'test-key-last-tab';

    beforeEach(async () => {
      latest = await getHookExecutionHarness(
        useCrossTabSessionStorage,
        [key, false],
        undefined,
        captureResult,
      );
      latest[1](true);
      await converge(() => {
        if (localStorage.getItem(getValueKey(key)) !== 'true') throw new Error('expected value to be set before unmounting');
      });
      await mount(<div />);
    });

    it('removes the value and registry keys once the last tab unmounts', () => converge(() => {
      if (localStorage.getItem(getValueKey(key)) !== null) throw new Error('expected value key to be cleared');
      if (localStorage.getItem(getRegistryKey(key)) !== null) throw new Error('expected registry key to be cleared');
    }));
  });

  describe('unmounting while another tab is still live preserves the value', () => {
    const key = 'test-key-not-last-tab';

    beforeEach(async () => {
      localStorage.setItem(getRegistryKey(key), JSON.stringify({
        'other-live-tab': Date.now(),
      }));

      latest = await getHookExecutionHarness(
        useCrossTabSessionStorage,
        [key, false],
        undefined,
        captureResult,
      );
      latest[1](true);
      await converge(() => {
        if (localStorage.getItem(getValueKey(key)) !== 'true') throw new Error('expected value to be set before unmounting');
      });
      await mount(<div />);
    });

    it('preserves the value because another tab is still live', () => converge(() => {
      if (localStorage.getItem(getValueKey(key)) !== 'true') throw new Error('expected value to be preserved');
    }));

    it("removes only this tab's own registry entry", () => converge(() => {
      const registry = JSON.parse(localStorage.getItem(getRegistryKey(key)) || '{}');
      if (!('other-live-tab' in registry)) throw new Error('expected the other tab to remain registered');
    }));
  });
});
