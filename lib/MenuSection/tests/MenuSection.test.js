/**
 * MenuSection tests
 */

import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';

import MenuSection from '../MenuSection';
import MenuSectionInteractor from './interactor';

describe('MenuSection', () => {
  const menuSection = new MenuSectionInteractor();
  const label = 'My label';
  const content = <div>Some content</div>;
  const className = 'some-class-name';

  beforeEach(async () => {
    await mount(
      <MenuSection label={label} className={className}>
        {content}
      </MenuSection>
    );
  });

  it('Should render a label if a node/string is passed to the label-prop', () => {
    expect(menuSection.hasLabel).to.be.true;
  });

  it('Should render content when passing anything as children', () => {
    expect(menuSection.hasContent).to.be.true;
  });

  it('Should apply any custom class passed to the className-prop', () => {
    expect(menuSection.className).to.include(className);
  });
});
