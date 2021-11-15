/**
 * NavList tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import { runAxeTest } from '@folio/stripes-testing';
import { mount } from '../../../tests/helpers';

import NavListInteractor from './interactor';
import NavList from '../NavList';
import NavListItem from '../../NavListItem';

describe('NavList', () => {
  const navList = new NavListInteractor();
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

  it('Should render any nodes passed as children', () => {
    expect(navList.hasChildren).to.be.true;
  });

  it('Should apply any custom class passed to the className-prop to the root element', () => {
    expect(navList.class).to.include(className);
  });

  it('Should apply any ID passed to the ID-prop to the root element', () => {
    expect(navList.id).to.include(id);
  });
});
