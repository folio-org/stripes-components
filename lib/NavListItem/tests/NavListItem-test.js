/**
 * NavListItem tests
 */

import React from 'react';
import { StaticRouter } from 'react-router'; /* eslint-disable-line import/no-extraneous-dependencies */
import { describe, beforeEach, it } from 'mocha';
import { including, NavListItem as NavListItemInteractor } from '@folio/stripes-testing';
import { mount } from '../../../tests/helpers';

import NavListItem from '../NavListItem';
import NavListSection from '../../NavListSection';

const RoledNavListItemInteractor = NavListItemInteractor.extend('navlist item')
  .filters({ tagName: el => el.tagName });

describe('NavListItem', () => {
  const navListItem = RoledNavListItemInteractor();

  beforeEach(async () => {
    await mount(
      <NavListSection activeLink="#hello-world">
        <NavListItem name="#hello-world">
          Hello world
        </NavListItem>
      </NavListSection>
    );
  });

  it('Should render with a <button> by default', () => navListItem.has({ tagName: 'BUTTON' }));

  it('Should render as active if name matches the activeLink-prop on a parent NavListSection', () => navListItem.has({ className: including('isActive') }));

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

    it('Should render with an <a> as root element', () => navListItem.has({ tagName: 'A' }));

    it('Should render as active if href matches the activeLink-prop on a parent NavListSection', () => navListItem.has({ className: including('isActive') }));
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

    it('Should render with an <a> as root element', () => navListItem.has({ tagName: 'A' }));

    it('Should render as active if to matches the activeLink-prop on a parent NavListSection', () => navListItem.has({ className: including('isActive') }));
  });
});
