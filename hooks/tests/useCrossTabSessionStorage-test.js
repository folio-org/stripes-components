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
  createCrossTabSessionStore,
  getValueKey,
  getRegistryKey,
  getChannelName,
} from '../useCrossTabSessionStorage';

const PREFIX = '@folio/stripes-components::crossTabSession::';

const clearAllSyncedStorage = () => {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k));
  Object.keys(sessionStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => sessionStorage.removeItem(k));
};

describe('useCrossTabSessionStorage', () => {
  let latest;
  let fakePeer;
  const captureResult = (result) => { latest = result; };

  afterEach(async () => {
    await mount(<div />);
    fakePeer?.close();
    fakePeer = undefined;
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

    it("persists an update to this tab's sessionStorage and local state", () => {
      latest[1](true);
      return converge(() => {
        if (latest?.[0] !== true) throw new Error('expected value to update to true');
        if (sessionStorage.getItem(getValueKey(key)) !== 'true') throw new Error('expected sessionStorage to be updated');
      });
    });

    it('supports the updater-function form', () => {
      latest[1]((prev) => !prev);
      return converge(() => {
        if (latest?.[0] !== true) throw new Error('expected value to toggle to true');
      });
    });
  });

  describe('cross-tab sync via BroadcastChannel', () => {
    const key = 'test-key-cross-tab';

    beforeEach(async () => {
      latest = await getHookExecutionHarness(
        useCrossTabSessionStorage,
        [key, false],
        undefined,
        captureResult,
      );
    });

    it('updates local state when another tab broadcasts a value', () => {
      fakePeer = new BroadcastChannel(getChannelName(key));
      fakePeer.postMessage({ type: 'value', value: true });

      return converge(() => {
        if (latest?.[0] !== true) throw new Error('expected value to sync from another tab');
      });
    });
  });

  describe('an already-open tab pushes its value when a new tab registers', () => {
    const key = 'test-key-push-on-registration';
    const incomingTabId = 'incoming-tab';
    let pushedMessage;

    beforeEach(async () => {
      latest = await getHookExecutionHarness(
        useCrossTabSessionStorage,
        [key, false],
        undefined,
        captureResult,
      );
      latest[1](true);
      await converge(() => {
        if (sessionStorage.getItem(getValueKey(key)) !== 'true') throw new Error('expected value to be set before simulating a new tab');
      });

      pushedMessage = undefined;
      fakePeer = new BroadcastChannel(getChannelName(key));
      fakePeer.onmessage = ({ data }) => { pushedMessage = data; };

      // A tab's own registry write never fires a `storage` event in that
      // same tab, so this dispatches the event manually to simulate what
      // the mounted hook would observe if a real second tab had just
      // written itself into the registry.
      const registry = JSON.parse(localStorage.getItem(getRegistryKey(key)) || '{}');
      registry[incomingTabId] = Date.now();
      const newValue = JSON.stringify(registry);
      localStorage.setItem(getRegistryKey(key), newValue);
      window.dispatchEvent(new StorageEvent('storage', {
        key: getRegistryKey(key),
        newValue,
        storageArea: window.localStorage,
      }));
    });

    it("pushes this tab's value without being asked", () => converge(() => {
      if (pushedMessage?.type !== 'value' || pushedMessage?.value !== true) {
        throw new Error('expected this tab to proactively broadcast its value');
      }
    }));
  });

  describe('a new tab with no live peer to push a value keeps the initial value', () => {
    const key = 'test-key-no-push';

    beforeEach(async () => {
      localStorage.setItem(getRegistryKey(key), JSON.stringify({
        'unresponsive-tab': Date.now(),
      }));

      latest = await getHookExecutionHarness(
        useCrossTabSessionStorage,
        [key, false],
        undefined,
        captureResult,
      );
    });

    it('never adopts a value because nobody pushes one', () => converge(() => {
      if (latest?.[0] !== false) throw new Error('expected value to remain the initial value');
    }));
  });

  describe('last tab closing clears the registry', () => {
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
        if (sessionStorage.getItem(getValueKey(key)) !== 'true') throw new Error('expected value to be set before unmounting');
      });
      await mount(<div />);
    });

    it('removes the registry key once the last tab unmounts', () => converge(() => {
      if (localStorage.getItem(getRegistryKey(key)) !== null) throw new Error('expected registry key to be cleared');
    }));
  });

  describe('unmounting while another tab is still live preserves the registry entry', () => {
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
      await mount(<div />);
    });

    it("removes only this tab's own registry entry", () => converge(() => {
      const registry = JSON.parse(localStorage.getItem(getRegistryKey(key)) || '{}');
      if (!('other-live-tab' in registry)) throw new Error('expected the other tab to remain registered');
    }));
  });
});

describe('createCrossTabSessionStore', () => {
  afterEach(() => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => sessionStorage.removeItem(k));
  });

  it('getValue returns the initial value when nothing is stored', () => {
    const store = createCrossTabSessionStore('vanilla-key-basic', false);
    if (store.getValue() !== false) throw new Error('expected initial value to be false');
  });

  it('setValue persists to sessionStorage, returns the resolved value, and updates getValue', () => {
    const key = 'vanilla-key-set';
    const store = createCrossTabSessionStore(key, false);

    const resolved = store.setValue(true);

    if (resolved !== true) throw new Error('expected setValue to return the resolved value');
    if (store.getValue() !== true) throw new Error('expected getValue to reflect the update');
    if (sessionStorage.getItem(getValueKey(key)) !== 'true') throw new Error('expected sessionStorage to be updated');
  });

  it('supports the updater-function form', () => {
    const key = 'vanilla-key-updater';
    const store = createCrossTabSessionStore(key, false);

    store.setValue(true);
    store.setValue((prev) => !prev);

    if (store.getValue() !== false) throw new Error('expected the updater form to toggle the value');
  });

  it('fans out setValue to every subscriber sharing a key in this tab', () => {
    const key = 'vanilla-key-fanout';
    const storeA = createCrossTabSessionStore(key, false);
    const storeB = createCrossTabSessionStore(key, false);

    let seenByA;
    let seenByB;
    const unsubscribeA = storeA.subscribe((value) => { seenByA = value; });
    const unsubscribeB = storeB.subscribe((value) => { seenByB = value; });

    try {
      storeA.setValue(true);

      if (seenByA !== true) throw new Error("expected the setting store's own subscriber to be notified");
      if (seenByB !== true) throw new Error("expected a sibling store's subscriber to be notified");
    } finally {
      unsubscribeA();
      unsubscribeB();
    }
  });

  it('clears the registry once the last subscriber for a key unsubscribes', () => {
    const key = 'vanilla-key-last-subscriber';
    const store = createCrossTabSessionStore(key, false);

    const unsubscribe = store.subscribe(() => {});
    store.setValue(true);
    unsubscribe();

    if (localStorage.getItem(getRegistryKey(key)) !== null) {
      throw new Error('expected the registry key to be cleared once the last subscriber unsubscribes');
    }
  });

  it('preserves the registry entry while another subscriber for the same key remains', () => {
    const key = 'vanilla-key-not-last-subscriber';
    const store = createCrossTabSessionStore(key, false);

    const unsubscribeA = store.subscribe(() => {});
    const unsubscribeB = store.subscribe(() => {});
    unsubscribeA();

    try {
      if (localStorage.getItem(getRegistryKey(key)) === null) {
        throw new Error('expected the registry entry to remain while a subscriber is still active');
      }
    } finally {
      unsubscribeB();
    }
  });

  it('interoperates with the React hook watching the same key in this tab', async () => {
    const key = 'vanilla-key-hook-interop';
    let latest;
    await getHookExecutionHarness(
      useCrossTabSessionStorage,
      [key, false],
      undefined,
      (result) => { latest = result; },
    );

    const store = createCrossTabSessionStore(key, false);
    const unsubscribe = store.subscribe(() => {});

    try {
      store.setValue(true);
      await converge(() => {
        if (latest?.[0] !== true) throw new Error('expected the hook to observe the vanilla store\'s update');
      });
    } finally {
      unsubscribe();
      await mount(<div />);
    }
  });
});
