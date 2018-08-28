/**
 * Layout tests
 */

import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';

import LayoutInteractor from './interactor';
import Layout from '../Layout';
import css from '../Layout.css';

describe.only('Layout', () => {
  const layout = new LayoutInteractor();

  beforeEach(async () => {
    await mountWithContext(
      <Layout
        className="margin-start-auto display-flex"
      >
        Test
      </Layout>
    );
  });

  it('Should map passed class names to any valid class names', () => {
    expect(layout.className).to.include(css['margin-start-auto']).and.to.include(css['display-flex']);
  });
});
