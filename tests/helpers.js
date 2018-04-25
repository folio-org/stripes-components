import React from 'react';
import ReactDOM from 'react-dom';

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

export function selectorFromClassnameString(str) {
  return str.replace(/\s/, '.');
}
