/**
 * Layer tests
 */

import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';

import Button from '../../Button';
import LayerHarness from './LayerHarness';
import LayerInteractor from './interactor';
import ButtonInteractor from '../../Button/tests/interactor';


const layer = new LayerInteractor();
const showButton = new ButtonInteractor('[data-test-show-layer]');
const overlayButton = new ButtonInteractor('[data-test-overlay-button]');
const hideButton = new ButtonInteractor('[data-test-hide-layer]');

function focusButton(id) {
  const btn = document.getElementById(id);
  btn.focus();
}

describe('Layer', () => {
  let layerHasClosed = false;
  let layerHasOpened = false;

  beforeEach(async () => {
    await mount(
      <LayerHarness
        contentLabel="test layer label"
        afterClose={() => { layerHasClosed = true; }}
        afterOpen={() => { layerHasOpened = true; }}
      >
        <div id="layerTestContent">Layer test content</div>
      </LayerHarness>
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

  describe('focus trapping', () => {
    beforeEach(async () => {
      await mount(
        <LayerHarness
          contentLabel="focus trap layer"
        >
          <div style={{ backgroundColor: '#555' }}>
            <Button buttonStyle="primary" data-test-button>Test Button</Button>
          </div>
        </LayerHarness>
      );
    });

    describe('opening the layer...', () => {
      beforeEach(async () => {
        await showButton.click();
      });

      it('opens/focuses the layer', () => {
        expect(layer.rendered).to.be.true;
        expect(layer.isFocused).to.be.true;
      });

      describe('focusing in the overlay container', () => {
        beforeEach(async () => {
          await focusButton('overlayButton');
        });

        it('focuses the overlayButton', () => {
          expect(overlayButton.isFocused).to.be.true;
        });

        describe('focusing outside of the modal', () => {
          beforeEach(async () => {
            await focusButton('outsideButton');
          });

          it('focuses the the layer element', () => {
            expect(layer.isFocused).to.be.true;
          });
        });
      });
    });
  });
});
