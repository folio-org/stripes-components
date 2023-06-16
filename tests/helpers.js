import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { computed } from '@bigtest/interactor';
import Harness from './Harness';

import '../lib/global.css';
import { getNextFocusable, getPreviousFocusable } from '../util/getFocusableElements';

let $root = null;
function getCleanTestingRoot() {
  // create a brand new root element
  if ($root) {
    $root.unmount();
    const container = document.getElementById('root');
    container.parentNode.removeChild(container);
  }

  if (!document.getElementById('root')) {
    const container = document.createElement('div');
    container.id = 'root';
    document.body.appendChild(container);
    $root = createRoot(container);
  }

  return $root;
};


export function mount(component) {
  return new Promise(resolve => {
    const root = getCleanTestingRoot();
    root.render(component);
    resolve();
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
    root.render(<Harness translations={translations} locale={locale}>{component}</Harness>);
    resolve();
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
