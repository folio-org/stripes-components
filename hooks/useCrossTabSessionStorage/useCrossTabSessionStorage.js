import { useCallback, useEffect, useMemo, useState } from 'react';


// Uses session storage with a thin localStorage-backed presence registry as a means to share
// values across tabs (like localStorage) but remove the values at closure (unlike localStorage.)
//
// With this implementation, the value itself never touches localStorage -
// each tab keeps its own copy in sessionStorage (private to that tab, dies with it), and live updates
// travel between tabs over a BroadcastChannel (in-memory, never written to
// disk). localStorage is used only for a small, non-sensitive presence
// registry (random tab ids + timestamps) that lets every already-open tab
// notice, via the native `storage` event.
//
// Multiple hook instances and/or vanilla stores in the same tab can share a
// key (e.g. the same SessionConfirmationModal rendered twice with the same
// sessionKey, or a hook and a vanilla store both watching "foo").
//
// Refcounting keeps exactly one heartbeat/
// channel alive per (key, tab), owned by whichever subscriber registered
// first; every subscriber still gets its own entry in `listeners` so each
// finds out when a `value` message arrives, whether it came from another
// tab (via the channel) or a sibling in this same tab (via `setValue`'s
// direct fan-out).
//
// Scenario 1 -- tab 2 picks up a value set in tab 1:
//
//   1. Tab 1 mounts the hook for key "foo". Registry for "foo" is empty;
//      tab 1's own sessionStorage has no cached value either, so its
//      initial value is `initialValue`. Tab 1 adds itself to the registry
//      (`{ tab1: t0 }`), starts heartbeating that entry, opens a
//      BroadcastChannel named after "foo", and remembers `{ tab1 }` as the
//      set of tab ids it already knows about.
//
//   2. User checks "don't show again"; tab 1 calls `setValue(true)`. This
//      writes `true` to tab 1's own sessionStorage and posts
//      `{ type: 'value', value: true }` on the "foo" channel.
//
//   3. User opens a second tab. Tab 2 mounts the hook for "foo": its own
//      sessionStorage is empty, so it renders `initialValue` for now, and
//      it writes itself into the registry (`{ tab1: t0, tab2: t1 }`).
//      Tab 2's own write never fires a `storage` event in tab 2 itself
//      (browsers never deliver `storage` events back to the tab that made
//      the change) -- but it does fire one in tab 1. Tab 1's handler diffs
//      the new registry against the `{ tab1 }` it remembered, notices
//      `tab2` is new, and -- since it holds a value for "foo" -- proactively
//      posts `{ type: 'value', value: true }` on the channel. Tab 2 was
//      already listening on that channel since before it wrote the
//      registry, so it receives the push and adopts `true` into its own
//      React state and sessionStorage cache.
//
//   4. If tab 1 later calls `setValue` again while tab 2 is still mounted,
//      tab 2 picks up the new value live via the same `{ type: 'value' }`
//      broadcast from step 2 -- ordinary live updates and a new tab joining
//      are handled by the exact same message.
//
// Scenario 2 -- a tab crashes, so it never runs unmount/pagehide cleanup:
//
//   1. Tab 1 is the only tab open for key "foo"; registry is `{ tab1: t0 }`,
//      refreshed every HEARTBEAT_INTERVAL_MS. Its value (`true`) exists
//      only in tab 1's own sessionStorage -- never in localStorage.
//
//   2. Tab 1's browser process is killed. Nothing fires `pagehide` or the
//      hook's unmount effect, so `{ tab1: t0 }` is left behind in the
//      registry, looking, to anyone else, like a tab that's still alive as
//      of `t0`. There is no leftover *value* to worry about at all, since
//      none was ever written outside of tab 1's now-gone sessionStorage.
//
//   3. A new tab opens before the registry entry ages out. It has no
//      sessionStorage cache of its own, so it renders `initialValue`
//      immediately and writes itself into the registry. That write would
//      normally prompt whichever live tab notices it to push its value --
//      but tab 1 no longer exists to react to anything, so nobody pushes,
//      and the new tab simply keeps rendering `initialValue`. No stale data
//      was ever at risk of being inherited.
//
//   4. Once any tab's heartbeat tick runs after `now - t0` exceeds
//      STALE_THRESHOLD_MS, pruning drops the dead `tab1` entry from the
//      registry, so it doesn't linger in localStorage indefinitely either.
//
//  ***Vanilla JS usage:
//
//   import { createCrossTabSessionStore } from '@folio/stripes-components';
//
//   const store = createCrossTabSessionStore('suppress-widget-warning', false);
//
//   // Read the value that's already in effect for this tab (e.g. on
//   // startup, before deciding whether to show a warning banner).
//   if (!store.getValue()) {
//     showWarningBanner();
//   }
//
//   // Persist + push a change to every other tab/subscriber watching this key.
//   dismissButton.addEventListener('click', () => {
//     store.setValue(true);
//     hideWarningBanner();
//   });
//
//   // Stay live-updated for as long as this code cares (this is also what
//   // registers this tab's presence -- call it once and hang onto the
//   // returned `unsubscribe`, _don't_ call `subscribe` again per update).
//   const unsubscribe = store.subscribe((suppressed) => {
//     if (suppressed) hideWarningBanner();
//   });
//
//   // Later, when this code no longer needs to watch the key (e.g. the
//   // widget is torn down):
//   unsubscribe();
//
// ------------------------------------------------------------------------------------------------------
//   ***React Hook usage:
//
//   import { useCrossTabSessionStorage } from '@folio/stripes-components';
//
//   const WarningBanner = () => {
//     const [suppressed, setSuppressed] = useCrossTabSessionStorage('suppress-widget-warning', false);
//
//     if (suppressed) return null;
//
//     return (
//       <Banner onDismiss={() => setSuppressed(true)}>
//         Something you should know about.
//       </Banner>
//     );
//   };
//
// `setSuppressed` also accepts an updater function, e.g.
// `setSuppressed((prev) => !prev)`, matching `useState`'s own convention.

const NAMESPACE = '@folio/stripes-components::crossTabSession::';
const TAB_ID_KEY = `${NAMESPACE}tabId`;

// Each live, non-crashed, open tab keeps itself alive via updating a timestamp at
// HEARTBEAT_INTERVAL_MS. Each time Pruning happens, timestamps are checked against the
// STALE_THRESHOLD_MS - 3x the Heartbeat and are pruned if they haven't been updated within that time.
export const HEARTBEAT_INTERVAL_MS = 5000;
export const STALE_THRESHOLD_MS = 15000;

export const getValueKey = (key) => `${NAMESPACE}${key}::value`;
export const getRegistryKey = (key) => `${NAMESPACE}${key}::registry`;
export const getChannelName = (key) => `${NAMESPACE}${key}::channel`;

let cachedTabId;

const createTabId = () => (
  crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
);

// The tab's id is stashed in sessionStorage.
// Storage access can throw in restrictive environments (old Safari Private Browsing, "block all site
// data" settings) -- fall back to a fresh, in-memory-only id rather than
// letting that exception escape into whatever called `getTabId`.
const getTabId = () => {
  if (cachedTabId) return cachedTabId;
  try {
    cachedTabId = window.sessionStorage.getItem(TAB_ID_KEY) || createTabId();
    window.sessionStorage.setItem(TAB_ID_KEY, cachedTabId);
  } catch (e) {
    cachedTabId = createTabId();
  }
  return cachedTabId;
};

const readRegistry = (registryKey) => {
  try {
    return JSON.parse(window.localStorage.getItem(registryKey)) ?? {};
  } catch (e) {
    return {};
  }
};

const writeRegistry = (registryKey, registry) => {
  try {
    window.localStorage.setItem(registryKey, JSON.stringify(registry));
  } catch (_e) {
    // Storage disabled/unavailable (quota exceeded, restrictive privacy
    // settings) -- degrade to no persistence rather than throwing out of a
    // heartbeat tick or a mount/unmount effect.
  }
};

const pruneRegistry = (registry, now = Date.now()) => {
  const pruned = {};
  Object.keys(registry).forEach((tabId) => {
    if (now - registry[tabId] <= STALE_THRESHOLD_MS) {
      pruned[tabId] = registry[tabId];
    }
  });
  return pruned;
};

const removeFromRegistry = (key, tabId) => {
  const registryKey = getRegistryKey(key);
  const registry = readRegistry(registryKey);
  delete registry[tabId];
  const liveRegistry = pruneRegistry(registry);

  // Once every tab that was using this key is gone, its presence entry is removed rather
  // than lingering in localStorage forever.
  if (Object.keys(liveRegistry).length === 0) {
    try {
      window.localStorage.removeItem(registryKey);
    } catch (_e) {
      // ignore -- see writeRegistry
    }
  } else {
    writeRegistry(registryKey, liveRegistry);
  }
};

// This tab's own last-known value for `key`, read synchronously on mount so
// a reloaded tab renders correctly on the very first frame without waiting
// on any other tab.
const readOwnValue = (valueKey, fallback) => {
  try {
    const raw = window.sessionStorage.getItem(valueKey);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
};

const writeOwnValue = (valueKey, value) => {
  try {
    window.sessionStorage.setItem(valueKey, JSON.stringify(value));
  } catch (e) {
    // ignore -- see writeRegistry
  }
};

const registrations = new Map();

const getOrCreateRegistration = (key) => {
  const existing = registrations.get(key);
  if (existing) {
    existing.count += 1;
    return existing;
  }

  const registryKey = getRegistryKey(key);
  const valueKey = getValueKey(key);
  const tabId = getTabId();

  const registry = pruneRegistry(readRegistry(registryKey));

  // The peer ids this tab already knew about before joining -- used below to
  // tell "a genuinely new tab just joined" apart from "a peer's routine
  // heartbeat re-stamped its existing entry", which touches the same
  // registry key but shouldn't trigger a broadcast.
  const knownTabIds = new Set(Object.keys(registry));
  registry[tabId] = Date.now();
  writeRegistry(registryKey, registry);

  // Piggyback pruning on every tab's own heartbeat tick (rather than
  // electing one tab to own it) so stale entries left by a crashed tab get
  // cleaned up as soon as any other tab is still alive to notice.
  const intervalId = setInterval(() => {
    const reg = pruneRegistry(readRegistry(registryKey));
    reg[tabId] = Date.now();
    writeRegistry(registryKey, reg);
  }, HEARTBEAT_INTERVAL_MS);

  // Older browsers/test environments without BroadcastChannel just lose
  // live cross-tab sync -- each tab still works from its own sessionStorage
  // cache, it just never hears about other tabs' updates.
  const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(getChannelName(key)) : null;
  const listeners = new Set();

  if (channel) {
    channel.onmessage = ({ data }) => {
      if (data?.type === 'value') {
        writeOwnValue(valueKey, data.value);
        listeners.forEach((listener) => listener(data.value));
      }
    };
  }

  // Fired when other tabs change the registry.
  // Checks for newly added keys, and if a new key is  present,
  // broadcasts the message for the new tab to sync.

  const handleRegistryStorage = (e) => {
    if (e.key !== registryKey) return;

    let latestIds;
    try {
      latestIds = new Set(Object.keys(JSON.parse(e.newValue) ?? {}));
    } catch (err) {
      return;
    }

    const hasNewPeer = [...latestIds].some((id) => id !== tabId && !knownTabIds.has(id));
    if (hasNewPeer && channel && window.sessionStorage.getItem(valueKey) !== null) {
      channel.postMessage({ type: 'value', value: readOwnValue(valueKey) });
    }

    knownTabIds.clear();
    latestIds.forEach((id) => knownTabIds.add(id));
  };
  window.addEventListener('storage', handleRegistryStorage);

  const registration = {
    count: 1, intervalId, tabId, channel, listeners, handleRegistryStorage, done: false,
  };
  registrations.set(key, registration);

  // The whole page is going away -- clean up immediately rather than
  // waiting on the heartbeat to notice, regardless of how many hook
  // instances are still "mounted" (they're all being destroyed together).
  window.addEventListener('pagehide', () => {
    if (registration.done) return;
    registration.done = true;
    clearInterval(registration.intervalId);
    window.removeEventListener('storage', registration.handleRegistryStorage);
    registration.channel?.close();
    registrations.delete(key);
    removeFromRegistry(key, registration.tabId);
  }, { once: true });

  return registration;
};

const releaseRegistration = (key) => {
  const registration = registrations.get(key);
  if (!registration || registration.done) return;

  registration.count -= 1;
  if (registration.count > 0) return;
  registration.done = true;

  clearInterval(registration.intervalId);
  window.removeEventListener('storage', registration.handleRegistryStorage);
  registration.channel?.close();
  registrations.delete(key);
  removeFromRegistry(key, registration.tabId);
};

// Guards against non-browser test environments, where the hook/store should
// behave like a plain in-memory value with no persistence or cross-tab sync.
const isBrowser = () => typeof window !== 'undefined' && window.localStorage && window.sessionStorage;

// The vanilla entry point. `getValue`/`setValue` work standalone; `subscribe`
// is what actually registers this tab's presence for `key` (registry entry,
// heartbeat, channel) -- for as long as at least one subscriber holds it --
// so a caller that only ever calls getValue/setValue participates in the
// synced value without holding a live presence entry for it, same as the
// hook only registers presence for as long as it's mounted.

export const createCrossTabSessionStore = (key, initialValue) => {
  const valueKey = getValueKey(key);

  const getValue = () => (isBrowser() ? readOwnValue(valueKey, initialValue) : initialValue);

  // `subscribe`'s listener only fires on *future* changes -- it does not
  // immediately invoke with the current value, so a caller wanting both an
  // initial value and live updates should call `getValue()` once and
  // `subscribe()` separately, same as the hook does below.

  const setValue = (next) => {
    if (!isBrowser()) return typeof next === 'function' ? next(initialValue) : next;

    const resolved = typeof next === 'function' ? next(readOwnValue(valueKey, initialValue)) : next;
    writeOwnValue(valueKey, resolved);

    const registration = registrations.get(key);
    if (registration) {
      registration.listeners.forEach((listener) => listener(resolved));
      registration.channel?.postMessage({ type: 'value', value: resolved });
    }
    return resolved;
  };

  const subscribe = (listener) => {
    if (!isBrowser()) return () => { };

    const registration = getOrCreateRegistration(key);
    registration.listeners.add(listener);

    return () => {
      registration.listeners.delete(listener);
      releaseRegistration(key);
    };
  };

  return { getValue, setValue, subscribe };
};

const useCrossTabSessionStorage = (key, initialValue) => {
  const store = useMemo(() => createCrossTabSessionStore(key, initialValue), [key]);
  const [value, setValueState] = useState(() => store.getValue());

  // `store.setValue` fans out to every same-tab subscriber for this key
  // (including this hook's own listener registered below), so this is the
  // only place `setValueState` needs to be wired up -- there's no need to
  // also update it directly inside `setValue`.
  useEffect(() => store.subscribe(setValueState), [store]);

  const setValue = useCallback((next) => store.setValue(next), [store]);

  return [value, setValue];
};

export default useCrossTabSessionStorage;
