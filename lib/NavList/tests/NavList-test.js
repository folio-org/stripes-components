/**
 * NavList tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { NavList as Interactor, Bigtest, including, runAxeTest } from '@folio/stripes-testing';
import { mount } from '../../../tests/helpers';

import NavList from '../NavList';
import NavListItem from '../../NavListItem';

describe('NavList', () => {
  const navList = new Interactor();
  const className = 'my-class';
  const id = 'my-id';

  beforeEach(async () => {
    await mount(
      <NavList className={className} id={id}>
        <NavListItem>Test</NavListItem>
      </NavList>
    );
  });

  it('Contains no axe errors - NavList', runAxeTest);

  it('Should render any nodes passed as children', () => Bigtest.Button('Test').exists());

  it('Should apply any custom class passed to the className-prop to the root element', () => navList.has({ className: including(className) }));

  it('Should apply any ID passed to the ID-prop to the root element', () => navList.has({ id }));
});
