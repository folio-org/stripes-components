/**
 * NavListSection tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import { runAxeTest } from '@folio/stripes-testing';
import { mount } from '../../../tests/helpers';

import NavListSectionInteractor from './interactor';
import NavListItem from '../../NavListItem';
import NavListSection from '../NavListSection';

describe('NavListSection', () => {
  const navListSection = new NavListSectionInteractor();

  beforeEach(async () => {
    await mount(
      <NavListSection activeLink="#hello-world" label="Hello world">
        <NavListItem href="#hello-world">
          Hello world
        </NavListItem>
      </NavListSection>
    );
  });

  it('contains no axe  - NavListSection', runAxeTest);

  it('Should render a header if a label is present', () => {
    expect(navListSection.header.isPresent).to.be.true;
  });
});
