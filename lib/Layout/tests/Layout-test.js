/**
 * Layout tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';

import LayoutInteractor from './interactor';
import Layout from '../Layout';
import css from '../Layout.css';

describe('Layout', () => {
  const layout = new LayoutInteractor();
  const customClassname = 'my-custom-classname';

  beforeEach(async () => {
    await mountWithContext(
      <Layout
        className={`margin-start-auto display-flex ${customClassname}`}
      >
        Test
      </Layout>
    );
  });

  it('Should map passed class names to any valid class names', () => {
    expect(layout.className).to.include(css['margin-start-auto']).and.to.include(css['display-flex']);
  });

  it('Should include custom non-mappable class names', () => {
    expect(layout.className).to.include(customClassname);
  });

  it('Should render with root element of "div"', () => {
    expect(layout.element).to.equal('DIV');
  });

  describe('Rendering a <Layout>-component with no className or children', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Layout />
      );
    });

    it('Should still render something', () => {
      expect(layout.isPresent).to.be.true;
    });
  });
});
