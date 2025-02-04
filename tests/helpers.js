import React from 'react';
import { createRoot } from 'react-dom/client';
import { computed } from '@bigtest/interactor';
import Harness from './Harness';

import '../lib/global.css';
import { getNextFocusable, getPreviousFocusable } from '../lib/util/getFocusableElements';

let $root = null;
let $container = null;
function getCleanTestingRoot() {
  if (!$container) {
    $container = document.createElement('div');
    $container.id = 'root';
    document.body.appendChild($container);
  }

  if ($root) {
    $root.unmount();
  }

  $root = createRoot($container);

  return $root;
};

const TestComponent = ({ component, callback }) => (
  <div style={{ width: '100vw', height: '100vh' }} ref={callback}>{component}</div>
)

export function mount(component) {
  return new Promise(resolve => {
    const root = getCleanTestingRoot();
    root.render(
      <TestComponent
        component={component}
        callback={resolve}
      />);
  });
}

/**
 * Mount the given component under a context with redux-store's Provider
 * and react-intl's IntlProvider.
 *
 * @param {*} component the component to mount
 * @param {*} translations an array of {translations, prefix} objects
 */
export function mountWithContext(component, translations, locale) {
  return new Promise(resolve => {
    const root = getCleanTestingRoot();
    root.render(<Harness translations={translations} locale={locale}>
      <TestComponent
        component={component}
        callback={resolve}
      />
      </Harness>);
  });
}

export function selectorFromClassnameString(str) {
  return str.replace(/\s/, '.');
}

export function computedStyle(selector, styleProperty) {
  return computed( function () { // eslint-disable-line
    if (styleProperty) {
      return getComputedStyle(this.$(selector))[styleProperty];
    }
    return getComputedStyle(this.$(selector));
  });
}

export function focusNext(current) {
  let elem = getNextFocusable(current);
  if (elem.tabIndex === -1) {
    elem = focusNext(elem);
  } else if (elem !== document.body) {
    elem.focus();
  }
}

export function focusPrevious(current) {
  let elem = getPreviousFocusable(current);
  if (elem.tabIndex === -1) {
    elem = focusPrevious(elem);
  } else if (elem !== document.body) {
    elem.focus();
  }
}
