/**
 * NavListSection tests
 */

import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
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

  it('Should render a header if a label is present', () => {
    expect(navListSection.header.isPresent).to.be.true;
  });
});
