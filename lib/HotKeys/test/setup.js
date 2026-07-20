import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiDOM from 'chai-dom';
import { render, cleanup } from '@folio/jest-config-stripes/testing-library/react';

function cleanTestRoot() {
  cleanup();
}

export function mount(node, container = 'div') {
  cleanTestRoot();
  const elem = document.createElement(container);
  elem.id = 'root';
  context = document.body.appendChild(elem);
  return render(node, { container: document.body.appendChild(elem) });
}

export function setup() {
  chai.use(sinonChai);
  chai.use(chaiDOM);
}
