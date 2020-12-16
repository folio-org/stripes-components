import React from 'react';
import { StaticRouter } from 'react-router'; /* eslint-disable-line import/no-extraneous-dependencies */
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';

import Button from '../Button';
import css from '../Button.css';
import { Button as Interactor } from '@folio/stripes-testing';

describe('Button', () => {
  const button = Interactor('test');
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

    it('renders a <button> tag', async () => {
      await button.is({ button: true });
    });

    it('renders with default class', async () => {
      await button.perform((e) => expect(e.classList.contains(css.default)).to.be.true);
    });

    it('renders child text as its label', async () => {
      await button.has({ text: 'test' });
    });

    it('has an id on the root element', async () => {
      await button.has({ id: 'button-test' });
    });

    describe('clicking the button', () => {
      beforeEach(async () => {
        // debugger
        await button.click();
      });

      it('calls the onClick handler', () => {
        expect(clicked).to.be.true;
      });
    });

    it('buttonRef callback returns a HTML button element', () => {
      expect(ref instanceof Element).to.be.true;
      expect(ref.tagName).to.equal('BUTTON');
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

    it('ref is an html button element', () => {
      expect(ref instanceof Element).to.be.true;
      expect(ref.tagName).to.equal('BUTTON');
    });
  });

  describe('When passed the bottomMargin0 prop', () => {
    beforeEach(async () => {
      await mount(
        <Button bottomMargin0>
          test
        </Button>
      );
    });

    it('has the bottomMargin0 class', async () => {
      await button.perform((e) => expect(e.classList.contains(css.marginBottom0)).to.be.true);
    });
  });

  describe('When passed an href prop', () => {
    let anchorClicked;

    beforeEach(async () => {
      anchorClicked = false;

      await mount(
        <Button href="#" onClick={() => { anchorClicked = true; }} id="button-test">
          test
        </Button>
      );
    });

    it('renders an <a> tag', async () => {
      await button.is({ anchor: true });
    });

    it('renders the href attribute properly', async () => {
      await button.has({ href: '#' });
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
          test
        </Button>
      );
    });

    it('should have the corresponding class names', async () => {
      await button.perform((e) => expect(e.classList.contains(css.marginBottom0)).to.be.true);
      await button.perform((e) => expect(e.classList.contains(css.primary)).to.be.true);
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
            test
          </Button>
        </StaticRouter>
      );
      await button.click();
    });

    it('renders an anchor tag', async () => {
      await button.is({ anchor: true });
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
