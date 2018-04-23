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
    const txt = 'test';

    await mount(
      <Button onClick={() => { clicked = true; }} id="button-test">
        {txt}
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
    expect(button.label).to.equal('test');
  });

  it('has an id on the root element', () => {
    expect(button.id).to.equal('button-test');
  });

  describe('clicking the button', () => {
    beforeEach(async () => {
      await button.clickButton();
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
    let anchorDefaultClick;

    beforeEach(async () => {
      anchorDefaultClick = false;

      await mount(
        <Button href="#" onClick={() => { anchorDefaultClick = true; }} id="button-test">
          anchor
        </Button>
      );

      await button.clickButton();
    });

    it('renders an <a> tag', async () => {
      expect(button.isAnchor).to.be.true;
    });

    describe('clicking the anchor', () => {
      beforeEach(async () => {
        await button.clickButton();
      });

      it('calls the click handler', async () => {
        await expect(anchorDefaultClick).to.be.true;
      });
    });
  });
});
