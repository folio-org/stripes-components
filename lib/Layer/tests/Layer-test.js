/**
 * Layer tests
 */

import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';

import LayerHarness from './LayerHarness';
import LayerInteractor from './interactor';
import ButtonInteractor from '../../Button/tests/interactor';

describe('Layer', () => {
  const layer = new LayerInteractor();
  const showButton = new ButtonInteractor('[data-test-show-layer]');
  const hideButton = new ButtonInteractor('[data-test-hide-layer]');

  let layerHasClosed = false;
  let layerHasOpened = false;

  beforeEach(async () => {
    await mount(
      <LayerHarness
        contentLabel="test layer label"
        afterClose={() => { layerHasClosed = true; }}
        afterOpen={() => { layerHasOpened = true; }}
      />
    );
  });

  it('does not render the layer content by default', () => {
    expect(layer.rendered).to.be.false;
  });

  describe('opening the layer', () => {
    beforeEach(async () => {
      layerHasOpened = false;
      await showButton.click();
    });

    it('shows the layer and content', () => {
      expect(layer.rendered).to.be.true;
      expect(document.getElementById('layerTestContent')).to.exist;
    });

    it('focuses the layer', () => {
      expect(layer.isFocused).to.be.true;
    });

    it('renders the provided aria label', () => {
      expect(layer.ariaLabel).to.equal('test layer label');
    });

    it('calls the afterOpen handler', () => {
      expect(layerHasOpened).to.be.true;
    });

    describe('closing the layer', () => {
      beforeEach(async () => {
        layerHasClosed = false;
        await hideButton.click();
      });

      it('hides the layer and content', () => {
        expect(layer.rendered).to.be.false;
        expect(document.getElementById('layerTestContent')).to.be.null;
      });

      it('calls the afterClose handler', () => {
        expect(layerHasClosed).to.be.true;
      });
    });
  });
});
