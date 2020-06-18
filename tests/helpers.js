import React from 'react';
import ReactDOM from 'react-dom';
import { computed } from '@bigtest/interactor';
import Harness from './Harness';

import '../lib/global.css';

function getCleanTestingRoot() {
  let $root = document.getElementById('root');

  // if a root exists, unmount anything inside and remove it
  if ($root) {
    ReactDOM.unmountComponentAtNode($root);
    $root.parentNode.removeChild($root);
  }

  // create a brand new root element
  $root = document.createElement('div');
  $root.id = 'root';

  document.body.appendChild($root);

  return $root;
}

export function mount(component) {
  return new Promise(resolve => {
    ReactDOM.render(component, getCleanTestingRoot(), resolve);
  });
}

/**
 * Mount the given component under a context with redux-store's Provider
 * and react-intl's IntlProvider.
 *
 * @param {*} component the component to mount
 * @param {*} translations an array of {translations, prefix} objects
 */
export function mountWithContext(component, translations) {
  return new Promise(resolve => {
    ReactDOM.render(
      <Harness translations={translations}>{component}</Harness>,
      getCleanTestingRoot(),
      resolve,
    );
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
