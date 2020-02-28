import React from 'react';
import { StaticRouter } from 'react-router'; /* eslint-disable-line import/no-extraneous-dependencies */
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';

import Button from '../Button';
import css from '../Button.css';
import ButtonInteractor from './interactor';

describe('Button', () => {
  const button = new ButtonInteractor();
  let clicked;
  let ref;

  describe('rendering a button', () => {
    beforeEach(async () => {
      clicked = false;

      await mount(
        <Button onClick={() => { clicked = true; }} id="button-test" buttonRef={r => { ref = r; }}>
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

      it('calls the onClick handler', () => {
        expect(clicked).to.be.true;
      });
    });

    it('buttonRef callback returns a HTML element instance', () => {
      expect(ref instanceof Element).to.be.true;
    });
  });

  describe('rendering a Button with a ref prop', () => {
    beforeEach(async () => {
      clicked = false;
      ref = null;
      await mount(
        <Button onClick={() => { clicked = true; }} id="button-test" ref={r => { ref = r; }}>
          test
        </Button>
      );
    });

    it('ref is an html instance', () => {
      expect(ref instanceof Element).to.be.true;
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

    it('renders an <a> tag', () => {
      expect(button.isAnchor).to.be.true;
    });

    it('renders the href attribute properly', () => {
      expect(button.href).to.equal('#');
    });

    describe('clicking the anchor', () => {
      beforeEach(async () => {
        await button.click();
      });

      it('calls the click handler', () => {
        expect(anchorClicked).to.be.true;
      });
    });
  });

  describe('Passing multiple button styles to buttonStyle', () => {
    beforeEach(async () => {
      await mount(
        <Button buttonStyle="marginBottom0 primary">
          My Button
        </Button>
      );
    });

    it('should have the corresponding class names', () => {
      expect(button.class).to.include(css.marginBottom0).and.to.include(css.primary);
    });
  });

  describe('Passing a string to the "to" prop', () => {
    const to = '/my-custom-url';
    clicked = false;
    ref = null;
    beforeEach(async () => {
      await mount(
        <StaticRouter context={{}}>
          <Button to={to} onClick={() => { clicked = true; }} buttonRef={r => { ref = r; }}>
            My Link Button
          </Button>
        </StaticRouter>
      );
      await button.click();
    });

    it('renders an anchor tag', () => {
      expect(button.isAnchor).to.be.true;
    });

    it('should still fire onClick event when clicked', () => {
      expect(clicked).to.be.true;
    });

    it('buttonRef callback should return the internal anchor of react-router-dom\'s <Link>', () => {
      expect(ref instanceof Element).to.be.true;
      expect(ref.tagName).to.equal('A');
    });
  });
});
