import React from 'react';
import ReactDOM from 'react-dom';
import { computed } from '@bigtest/interactor';
import axe from 'axe-core';
import { expect } from 'chai';
import Harness from './Harness';



import '../lib/global.css';
import { getNextFocusable, getPreviousFocusable } from '../util/getFocusableElements';


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


const config = {
  rules: {
    'color-contrast': { enabled: false },
    'link-in-text-block': { enabled: false }
  }
};



// axe testing utility
// usage:
// it('has no axe errors', runAxeTest);

function axeTest() {
  return new Promise((resolve) => {
    const rootNode = document.getElementById('root');
    axe.run(rootNode, config, (err, { violations }) => {
      resolve(err, violations);
    });
  });
}

function axeResolve(err, violations) {
  expect(err).toBe(null);
  expect(violations).toHaveLength(0);
}

export function runAxeTest() {
  axeTest(axeResolve);
}
