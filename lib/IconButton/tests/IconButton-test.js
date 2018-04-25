import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { HashRouter as Router } from 'react-router-dom';

import { mount } from '../../../tests/helpers';

import IconButton from '../IconButton';
import IconButtonInteractor from './interactor';

describe('IconButton', () => {
  const iconButton = new IconButtonInteractor();
  let ibClicked;

  beforeEach(async () => {
    await mount(
      <Router>
        <IconButton id="testId" icon="search" onClick={() => { ibClicked = true; }} />
      </Router>
    );
  });

  it('renders a <button> by default', () => {
    expect(iconButton.isButton).to.be.true;
  });

  it('renderes passed id prop', () => {
    expect(iconButton.id).to.equal('testId');
  });

  describe('clicking the IconButton', () => {
    ibClicked = false;

    beforeEach(async () => {
      await iconButton.clickIconButton();
    });

    it('calls the onClick handler', () => {
      expect(ibClicked).to.be.true;
    });
  });

  describe('When passed an href prop', () => {
    beforeEach(async () => {
      await mount(
        <Router>
          <IconButton id="anchorId" icon="search" href="#" />
        </Router>
      );
    });

    it('renders an anchor tag', () => {
      expect(iconButton.isAnchor).to.be.true;
    });

    it('properly renders the href attribute', () => {
      expect(iconButton.href).to.equal('#/#');
    });
  });

  describe('When passed an to prop (string)', () => {
    beforeEach(async () => {
      await mount(
        <Router>
          <IconButton id="anchorId" icon="search" to="#" />
        </Router>
      );
    });

    it('renders an anchor tag', () => {
      expect(iconButton.isAnchor).to.be.true;
    });

    it('properly renders the href attribute', () => {
      expect(iconButton.href).to.match(/#$/);
    });
  });

  describe('When passed an to prop (object)', () => {
    const toObject = {
      hash: '#latest'
    };

    beforeEach(async () => {
      await mount(
        <Router>
          <IconButton id="anchorId" icon="search" to={toObject} />
        </Router>
      );
    });

    it('renders an anchor tag', () => {
      expect(iconButton.isAnchor).to.be.true;
    });

    it('properly renders the href attribute', () => {
      expect(iconButton.href).to.match(/#latest$/);
    });
  });
});
