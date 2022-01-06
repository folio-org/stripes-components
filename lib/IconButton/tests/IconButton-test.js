import React from 'react';

import {
  beforeEach,
  describe,
  it
} from 'mocha';

import { expect } from 'chai';
import { StaticRouter as Router } from 'react-router-dom';

import { IconButton as Interactor, including, converge, Badge as BadgeInteractor, runAxeTest } from '@folio/stripes-testing';
import { mount } from '../../../tests/helpers';

import IconButton from '../IconButton';

describe('IconButton', () => {
  const iconButton = Interactor('search');
  let ibClicked;

  beforeEach(async () => {
    await mount(
      <Router context={{}}>
        <IconButton id="testId" icon="search" onClick={() => { ibClicked = true; }} />
      </Router>
    );
  });

  it('renders a <button> by default', async () => {
    await iconButton.is({ button: true });
  });

  it('renders passed id prop', () => iconButton.has({ id: 'testId' }));

  it('has no axe errors - IconButton', runAxeTest);

  describe('clicking the IconButton', () => {
    ibClicked = false;

    beforeEach(async () => {
      await iconButton.click();
    });

    it('calls the onClick handler', async () => {
      await converge(() => expect(ibClicked).to.be.true);
    });
  });

  describe('When passed an href prop', () => {
    beforeEach(async () => {
      await mount(
        <Router context={{}}>
          <IconButton id="anchorId" icon="search" href="/testPath" />
        </Router>
      );
    });

    it('renders an anchor tag', () => iconButton.is({ anchor: true }));
    it('properly renders the href attribute', () => iconButton.has({ href: '/testPath' }));
  });

  describe('When passed an to prop (string)', () => {
    beforeEach(async () => {
      await mount(
        <Router context={{}}>
          <IconButton id="anchorId" icon="search" to="/testPath" />
        </Router>
      );
    });
    it('renders an anchor tag', () => iconButton.is({ anchor: true }));
    it('properly renders the href attribute', () => iconButton.has({ href: '/testPath' }));
  });

  describe('When passed an to prop (object)', () => {
    const toObject = {
      hash: '#latest'
    };

    beforeEach(async () => {
      await mount(
        <Router context={{}}>
          <IconButton id="anchorId" icon="search" to={toObject} />
        </Router>
      );
    });
    it('renders an anchor tag', () => iconButton.is({ anchor: true }));
    it('properly renders the href attribute', () => iconButton.has({ hash: '#latest' }));
  });

  describe('testing badges', () => {
    const badge = BadgeInteractor('2');
    beforeEach(async () => {
      await mount(
        <IconButton id="badgeButton" icon="search" badgeCount="2" />
      );
    });

    it('displays badge with supplied count', async () => {
      badge.has({ value: '2' });
    });
  });

  describe('badge color', () => {
    const badge = BadgeInteractor('2');
    beforeEach(async () => {
      await mount(
        <IconButton id="badgeButton" badgeColor="red" icon="search" badgeCount="2" />
      );
    });

    it('displays badge with supplied color', async () => {
      await badge.has({ color: including('red') });
    });
  });
});
