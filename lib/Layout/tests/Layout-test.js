/**
 * Layout tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { including } from '@folio/stripes-testing';
import { RoledHTML } from '../../../tests/helpers/localInteractors';

import { mountWithContext } from '../../../tests/helpers';

import Layout from '../Layout';

const LayoutInteractor = RoledHTML.extend('layout')
  .selector('[data-test-layout]');

describe('Layout', () => {
  const layout = LayoutInteractor({ text:'Test', tagName: 'DIV' });
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

  it('Should map passed class names to any valid class names', () => layout.has({ className: including('margin-start-auto') }));

  it('Should include custom non-mappable class names', () => layout.has({ className: including(customClassname) }));

  it('Should render with root element of "div"', () => layout.has({ tagName: 'DIV' }));

  describe('Rendering a <Layout>-component with no className or children', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Layout />
      );
    });

    it('Should still render something', () => LayoutInteractor({ visible: false }).exists());
  });
});
