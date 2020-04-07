/**
 * NavListItem tests
 */

import React from 'react';
import { StaticRouter } from 'react-router'; /* eslint-disable-line import/no-extraneous-dependencies */
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { mount } from '../../../tests/helpers';

import NavListItemInteractor from './interactor';
import NavListItem from '../NavListItem';
import NavListSection from '../../NavListSection';

describe('NavListItem', () => {
  const navListItem = new NavListItemInteractor();

  beforeEach(async () => {
    await mount(
      <NavListSection activeLink="#hello-world">
        <NavListItem name="#hello-world">
          Hello world
        </NavListItem>
      </NavListSection>
    );
  });

  it('Should render with a <button> by default', () => {
    expect(navListItem.tagName).to.equal('button');
  });

  it('Should render as active if name matches the activeLink-prop on a parent NavListSection', () => {
    expect(navListItem.isActive).to.be.true;
  });

  describe('If a href is passed to NavListItem', () => {
    beforeEach(async () => {
      await mount(
        <NavListSection activeLink="#hello-world">
          <NavListItem href="#hello-world">
            Hello world
          </NavListItem>
        </NavListSection>
      );
    });

    it('Should render with an <a> as root element', () => {
      expect(navListItem.tagName).to.equal('a');
    });

    it('Should render as active if href matches the activeLink-prop on a parent NavListSection', () => {
      expect(navListItem.isActive).to.be.true;
    });
  });

  describe('If a to-prop is passed to NavListItem', () => {
    beforeEach(async () => {
      await mount(
        <StaticRouter context={{}}>
          <NavListSection activeLink="#hello-world">
            <NavListItem to="#hello-world">
              Hello world
            </NavListItem>
          </NavListSection>
        </StaticRouter>
      );
    });

    it('Should render with an <a> as root element', () => {
      expect(navListItem.tagName).to.equal('a');
    });

    it('Should render as active if to matches the activeLink-prop on a parent NavListSection', () => {
      expect(navListItem.isActive).to.be.true;
    });
  });
});
