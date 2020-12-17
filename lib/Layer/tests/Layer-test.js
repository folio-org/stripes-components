/**
 * Layer tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import { Layer as Interactor, Button as ButtonInteractor, Generic as GenericInteractor } from '@folio/stripes-testing';
import { mount } from '../../../tests/helpers';

import Button from '../../Button';
import LayerHarness from './LayerHarness';

describe('Layer', () => {
  const layer = Interactor('test layer label');
  const overlayButton = ButtonInteractor({ text: 'Overlay Button' });
  const showButton = ButtonInteractor({ text: 'show layer' });
  const hideButton = ButtonInteractor({ text: 'hide layer' });

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

  it('does not render the layer content by default', () => layer.absent());

  describe('opening the layer', () => {
    beforeEach(async () => {
      layerHasOpened = false;
      await showButton.click();
    });

    it('shows the layer and content', async () => {
      await layer.is({ visible: true });
      await GenericInteractor({ id: 'layerTestContent' }).exists();
    });

    it('focuses the layer', () => layer.is({ focused: true }));

    it('renders the provided aria label', () => layer.has({ ariaLabel: 'test layer label' }));

    it('calls the afterOpen handler', () => {
      expect(layerHasOpened).to.be.true;
    });

    describe('closing the layer', () => {
      beforeEach(async () => {
        layerHasClosed = false;
        await hideButton.click();
      });

      it('hides the layer and content', async () => {
        await layer.absent();
        await GenericInteractor({ id: 'layerTestContent' }).absent();
      });

      it('calls the afterClose handler', () => {
        expect(layerHasClosed).to.be.true;
      });
    });
  });

  describe('focus trapping', () => {
    const focusLayer = Interactor('focus trap layer');
    const focusCatcherButton = ButtonInteractor({ text: 'focus catcher' });

    beforeEach(async () => {
      await mount(
        <LayerHarness
          contentLabel="focus trap layer"
        >
          <div style={{ backgroundColor: '#555' }}>
            <Button buttonStyle="primary">Test Button</Button>
          </div>
        </LayerHarness>
      );
    });

    describe('opening the layer...', () => {
      beforeEach(async () => {
        await showButton.click();
      });

      it('opens/focuses the layer', async () => focusLayer.is({ visible: true, focused: true }));

      describe('focusing in the overlay container', () => {
        beforeEach(async () => {
          await overlayButton.focus();
        });

        it('focuses the overlayButton', () => overlayButton.is({ focused: true }));

        describe('focusing outside of the modal', () => {
          beforeEach(async () => {
            await focusCatcherButton.focus();
          });

          it('focuses the layer element', () => focusLayer.is({ focused: true }));
        });
      });
    });
  });
});
