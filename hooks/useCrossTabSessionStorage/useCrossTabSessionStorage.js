import { useCallback, useEffect, useRef, useState } from 'react';

// useCrossTabSessionStorage(key, initialValue) => [value, setValue]
//
// Use-case: a `useState`-like value (e.g. "don't show this confirmation
// again") that should be shared live across every currently-open browser
// tab, but should behave like sessionStorage in every other respect -- a
// brand new browser session (no tabs open beforehand) must never inherit a
// value left over from a previous session.
//
// sessionStorage itself can't do this: it's tab-scoped by spec, and the
// native `storage` event never fires for sessionStorage changes across
// tabs. So the value is actually kept in localStorage (which *does* emit
// `storage` events cross-tab) and paired with a small "which tabs are still
// open for this key" presence registry, so we can tell the difference
// between "another tab is still using this value" (keep it) and "every tab
// that ever used this value is gone" (treat it as a stale leftover and
// discard it, same as a fresh sessionStorage key would be).
//
// Example 1 -- tab 2 picks up a value set in tab 1:
//   1. Tab 1 mounts the hook for key "foo". Registry for "foo" is empty, so
//      this is treated as a new session; tab 1 adds itself to the registry
//      in local storage - (`{ tab1: t0 }`) and starts heartbeating that entry.
//   2. User checks "don't show again"; tab 1 calls `setValue(true)`. This
//      writes `foo::value = true` to localStorage and updates tab 1's own
//      React state directly (storage events don't fire in the tab that
//      wrote them).
//   3. User opens a second tab on the same origin. Tab 2 mounts the hook
//      for key "foo". Its `computeInitialValue` prunes the registry, finds
//      tab 1's entry is still fresh, and reads `foo::value` -- so tab 2's
//      initial state is `true` without ever calling `setValue` itself. Tab
//      2 then adds itself to the registry too (`{ tab1: t0, tab2: t1 }`).
//   4. If tab 1 later called `setValue` again while tab 2 stayed mounted,
//      tab 2 would pick up the change live via the `storage` event handler
//      instead of needing to remount.
//
// Example 2 -- a tab crashes, so it never runs unmount/pagehide cleanup:
//   1. Tab 1 is the only tab open for key "foo"; registry is `{ tab1: t0 }`,
//      refreshed every HEARTBEAT_INTERVAL_MS. `foo::value` is `true`.
//   2. Tab 1's browser process is killed. Nothing fires `pagehide` or the
//      hook's unmount effect, so `{ tab1: t0 }` and `foo::value = true`
//      are simply left behind in localStorage -- looking, to anyone else,
//      like a tab that's still alive as of `t0`.
//   3. Some time later (> STALE_THRESHOLD_MS after t0), a brand new tab
//      opens and mounts the hook for "foo". `computeInitialValue` reads the
//      registry, prunes `tab1` because `now - t0` exceeds the stale
//      threshold, and is left with an empty registry.
//   4. An empty registry means "no live tab is still using this value", so
//      this new tab treats it as the start of a fresh session: it clears
//      `foo::value` and returns `initialValue` instead of the stale `true`
//      -- exactly as if this were a normal sessionStorage key that had
//      never been set. It then adds itself as the new sole registry entry.

//   If instead a second tab had opened *before* the stale threshold passed,
//   pruning would still find tab 1's entry "live" (even though tab 1 is
//   actually gone) and would incorrectly inherit `true` -- an accepted
//   trade-off between promptness and false-negative staleness detection.

const NAMESPACE = '@folio/stripes-components::crossTabSession::';
const TAB_ID_KEY = `${NAMESPACE}tabId`;

// A crashed/killed tab never gets to run its unmount cleanup, so presence
// can't rely on unmount alone -- each live tab instead re-stamps its own
// registry entry on this interval, and any entry older than the stale
// threshold is treated as belonging to a dead tab. 3x the heartbeat gives
// some slack for a slow tab/tick before it's wrongly declared dead.
export const HEARTBEAT_INTERVAL_MS = 5000;
export const STALE_THRESHOLD_MS = 15000;

export const getValueKey = (key) => `${NAMESPACE}${key}::value`;
export const getRegistryKey = (key) => `${NAMESPACE}${key}::registry`;

let cachedTabId;

const createTabId = () => (
  crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
);

// The tab's id is stashed in sessionStorage -- sessionStorage survives
// reloads/navigation within a tab, but disappears the moment the
// tab truly closes), so reusing it means a reloaded tab keeps its existing
// registry entry instead of leaking a new one.
const getTabId = () => {
  cachedTabId ??= window.sessionStorage.getItem(TAB_ID_KEY) || createTabId();
  window.sessionStorage.setItem(TAB_ID_KEY, cachedTabId);
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
  window.localStorage.setItem(registryKey, JSON.stringify(registry));
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

const readValue = (valueKey, fallback) => {
  try {
    const raw = window.localStorage.getItem(valueKey);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
};

const writeValue = (valueKey, value) => {
  window.localStorage.setItem(valueKey, JSON.stringify(value));
};

const clearValue = (valueKey) => {
  window.localStorage.removeItem(valueKey);
};

// Called synchronously on mount (not deferred to an effect) so a component
// never renders a stale/incorrect value even for a single frame: if pruning
// finds no other live tab for this key, this tab is the first one, which
// means whatever is sitting in the value key is a leftover from a session
// that has already fully ended (e.g. a crash) -- so it's discarded here
// rather than inherited.
const computeInitialValue = (key, fallback) => {
  const liveRegistry = pruneRegistry(readRegistry(getRegistryKey(key)));
  if (Object.keys(liveRegistry).length === 0) {
    clearValue(getValueKey(key));
    return fallback;
  }
  return readValue(getValueKey(key), fallback);
};

// Multiple hook instances in the same tab can share a key (e.g. the same
// SessionConfirmationModal rendered twice with the same sessionKey). They
// must not each start their own heartbeat interval or each try to run the
// "last tab" cleanup independently -- that would double-write the registry
// and risk one instance clearing the value while a sibling is still
// mounted. Refcounting keeps exactly one heartbeat/writer alive per
// (key, tab), owned by whichever instance registered first.
const registrations = new Map();

const registerTab = (key) => {
  const existing = registrations.get(key);
  if (existing) {
    existing.count += 1;
    return;
  }

  const registryKey = getRegistryKey(key);
  const tabId = getTabId();

  const registry = pruneRegistry(readRegistry(registryKey));
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

  registrations.set(key, { count: 1, intervalId, tabId, done: false });
};

const unregisterTab = (key) => {
  const registration = registrations.get(key);
  if (!registration || registration.done) return;

  registration.count -= 1;
  if (registration.count > 0) return;
  registration.done = true;

  clearInterval(registration.intervalId);
  registrations.delete(key);

  const registryKey = getRegistryKey(key);
  const registry = readRegistry(registryKey);
  delete registry[registration.tabId];
  const liveRegistry = pruneRegistry(registry);

  // This is what gives the value true session semantics:
  // once every tab that was using this key is gone,
  // the value is removed rather than lingering in localStorage forever.
  if (Object.keys(liveRegistry).length === 0) {
    window.localStorage.removeItem(registryKey);
    clearValue(getValueKey(key));
  } else {
    writeRegistry(registryKey, liveRegistry);
  }
};

// Guards against non-browser test environments, where the hook should
// behave like plain useState with no persistence or cross-tab sync.
const isBrowser = () => typeof window !== 'undefined' && window.localStorage && window.sessionStorage;

const useCrossTabSessionStorage = (key, initialValue) => {
  const browser = isBrowser();
  const valueKey = getValueKey(key);
  const initialValueRef = useRef(initialValue);
  initialValueRef.current = initialValue;

  const [value, setValueState] = useState(() => (
    browser ? computeInitialValue(key, initialValue) : initialValue
  ));

  useEffect(() => {
    if (!browser) return undefined;

    registerTab(key);

    // The native `storage` event only fires in *other* tabs, never in the
    // tab that made the write -- this is what picks up a value set by
    // another tab and applies it to this tab's React state.
    const handleStorage = (e) => {
      if (e.key === valueKey) {
        setValueState(e.newValue === null ? initialValueRef.current : JSON.parse(e.newValue));
      }
    };

    // Best-effort fast path so the value doesn't linger for the full stale
    // threshold after a normal tab close. Not relied on for correctness --
    // a crashed tab never fires this -- the heartbeat/pruning above is the
    // authoritative mechanism; this just makes the common case snappier.
    // `pagehide` is used over `beforeunload` since it doesn't block the
    // back/forward cache and fires more reliably (e.g. on mobile Safari).
    const handlePageHide = () => unregisterTab(key);

    window.addEventListener('storage', handleStorage);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('pagehide', handlePageHide);
      unregisterTab(key);
    };
  }, [browser, key, valueKey]);

  const setValue = useCallback((next) => {
    setValueState((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      // Written directly here, not left for the storage-event handler above,
      // because `storage` events never fire in the originating tab.
      if (browser) {
        writeValue(getValueKey(key), resolved);
      }
      return resolved;
    });
  }, [browser, key]);

  return [value, setValue];
};

export default useCrossTabSessionStorage;
