/**
 * NavListSection tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { including, runAxeTest } from '@folio/stripes-testing';
import { RoledHTML } from '../../../tests/helpers/localInteractors';
import { mount } from '../../../tests/helpers';

import NavListItem from '../../NavListItem';
import NavListSection from '../NavListSection';

describe('NavListSection', () => {
  beforeEach(async () => {
    await mount(
      <NavListSection activeLink="#hello-world" label="Hello world header">
        <NavListItem href="#hello-world">
          Hello world
        </NavListItem>
      </NavListSection>
    );
  });

  it('contains no axe  - NavListSection', runAxeTest);

  it('Should render a header if a label is present', () => RoledHTML({ text: 'Hello world header', className: including('headline') }).exists());
});
