import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { Interactor } from '@bigtest/interactor';
import { expect } from 'chai';
import sinon from 'sinon';

import { mountWithContext } from '../../../tests/helpers';

import Paneset from '../../Paneset';
import Pane from '../Pane';
import PaneInteractor from './interactor';

describe('Pane', () => {
  const pane = new PaneInteractor();

  beforeEach(async () => {
    await mountWithContext(
      <Paneset>
        <Pane defaultWidth="fill" />
      </Paneset>
    );
  });

  it('renders the pane', () => {
    expect(pane.isPresent).to.be.true;
  });

  describe('Dismissible pane', () => {
    const dismissPane = new PaneInteractor('#dismissible');
    const onClose = sinon.spy();

    beforeEach(async () => {
      await mountWithContext(
        <Paneset>
          <Pane
            defaultWidth="fill"
          />
          <Pane
            id="dismissible"
            defaultWidth="50%"
            dismissible
            onClose={onClose}
          />
        </Paneset>
      );
    });

    it('renders', () => {
      expect(dismissPane.isPresent).to.be.true;
    });

    it('dismiss button is present', () => {
      expect(dismissPane.dismissButton.isPresent).to.be.true;
    });

    describe('clicking the dismiss button', () => {
      beforeEach(async () => {
        await dismissPane.dismissButton.click();
      });

      it('calls the onClose handler', () => {
        expect(onClose.called).to.be.true;
      });
    });
  });

  describe('Pane with transition, height props', () => {
    const heightPane = new PaneInteractor('#heightpane');

    beforeEach(async () => {
      await mountWithContext(
        <Paneset>
          <Pane
            defaultWidth="fill"
            dismissible
          />
          <Pane
            id="heightpane"
            defaultWidth="50%"
            transition="slide"
            dismissible
            height="500px"
          />
        </Paneset>
      );
    });

    it('renders', () => {
      expect(heightPane.isPresent).to.be.true;
    });
  });

  describe('Pane with transition, height props', () => {
    const heightPane = new PaneInteractor('#heightpane');
    const onClose = sinon.spy();

    beforeEach(async () => {
      await mountWithContext(
        <Paneset>
          <Pane
            defaultWidth="fill"
            dismissible
          />
          <Pane
            id="heightpane"
            defaultWidth="50%"
            transition="slide"
            dismissible
            height="500px"
            onClose={onClose}
          />
        </Paneset>
      );
    });

    it('renders', () => {
      expect(heightPane.isPresent).to.be.true;
    });

    describe('dismissing the pane with transition', () => {
      beforeEach(async () => {
        await heightPane.dismissButton.click();
      });

      it('calls the onClose handler', () => {
        expect(onClose.called).to.be.true;
      });
    });
  });

  describe('content width, focus method coverage', () => {
    const fluidpane = new PaneInteractor('#fluidpane');
    const fluidpane2 = new PaneInteractor('#fluidpane2');
    const fluidpane3 = new PaneInteractor('#fluidpane3');
    const input2 = new Interactor('#input2');
    beforeEach(async () => {
      await mountWithContext(
        <Paneset>
          <Pane id="fluidpane" defaultWidth="fill" fluidContentWidth={false}>
            <p>Some Content</p>
            <input type="text" id="input" />
            <button type="button">Content button 1</button>
          </Pane>
          <Pane id="fluidpane2" defaultWidth="50%" transition="slide" fluidContentWidth={false}>
            <p>Some Content</p>
            <input type="text" id="input2" />
            <button type="button">Content button 2</button>
          </Pane>
          <Pane id="fluidpane3" defaultWidth="25%" transition="slide" fluidContentWidth>
            <p>Some Content</p>
            <input type="text" id="input3" />
            <button type="button">Content button 3</button>
          </Pane>
        </Paneset>
      );
    });

    it('renders the pane', () => {
      expect(fluidpane.isPresent).to.be.true;
      expect(fluidpane2.isPresent).to.be.true;
      expect(fluidpane3.isPresent).to.be.true;
    });

    describe('focusing within a pane', () => {
      beforeEach(async () => {
        await input2.$root.focus();
      });

      it('focuses input', () => {
        expect(document.activeElement.id).to.equal(input2.$root.id);
      });
    });
  });
});
