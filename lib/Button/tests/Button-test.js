import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';

import Button from '../Button';
import ButtonInteractor from './interactor';

describe('Button', () => {
  const button = new ButtonInteractor();
  let clicked;

  beforeEach(async () => {
    clicked = false;

    await mount(
      <Button onClick={() => { clicked = true; }} id="button-test">
        test
      </Button>
    );
  });

  it('renders a <button> tag', () => {
    expect(button.isButton).to.be.true;
  });

  it('renders with default class', () => {
    expect(button.rendersDefault).to.be.true;
  });

  it('renders child text as its label', () => {
    expect(button.text).to.equal('test');
  });

  it('has an id on the root element', () => {
    expect(button.id).to.equal('button-test');
  });

  describe('clicking the button', () => {
    beforeEach(async () => {
      await button.click();
    });

    it('calls the onClick handler', async () => {
      await expect(clicked).to.be.true;
    });
  });

  describe('When passed the bottomMargin0 prop', () => {
    beforeEach(async () => {
      await mount(
        <Button bottomMargin0>
          anchor
        </Button>
      );
    });

    it('has the bottomMargin0 class', () => {
      expect(button.rendersBottomMargin0).to.be.true;
    });
  });

  describe('When passed an href prop', () => {
    let anchorClicked;

    beforeEach(async () => {
      anchorClicked = false;

      await mount(
        <Button href="#" onClick={() => { anchorClicked = true; }} id="button-test">
          anchor
        </Button>
      );
    });

    it('renders an <a> tag', async () => {
      expect(button.isAnchor).to.be.true;
    });

    it('renders the href attribute properly', () => {
      expect(button.href).to.equal('#');
    });

    describe('clicking the anchor', () => {
      beforeEach(async () => {
        await button.click();
      });

      it('calls the click handler', async () => {
        await expect(anchorClicked).to.be.true;
      });
    });
  });
});
