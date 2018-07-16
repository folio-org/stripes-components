import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';

import Icon from '../Icon';
import IconInteractor from './interactor';

describe('Icon', () => {
  const icon = new IconInteractor();

  describe('rendering an icon', () => {
    beforeEach(async () => {
      await mount(
        <Icon
          id="icon-id"
          title="icon-title"
          icon="bookmark"
          iconClassName="icon-class"
          iconRootClass="icon-root-class"
        />
      );
    });

    it('renders an <svg> tag', () => {
      expect(icon.isSvg).to.be.true;
    });

    it('renders supplied title', () => {
      expect(icon.title).to.equal('icon-title');
    });

    it('renders with default size medium', () => {
      expect(icon.isMedium).to.be.true;
    });

    it('renders the supplied id on the root element', () => {
      expect(icon.id).to.equal('icon-id');
    });

    it('renders the supplied classname on the root element', () => {
      expect(icon.hasClass('icon-root-class')).to.be.true;
    });

    it('renders the supplied classname on the svg element', () => {
      expect(icon.hasSvgClass('icon-class')).to.be.true;
    });
  });

  describe('rendering a small icon', () => {
    beforeEach(async () => {
      await mount(
        <Icon
          id="icon-id"
          icon="bookmark"
          size="small"
        />
      );
    });

    it('renders with size to be small', () => {
      expect(icon.isSmall).to.be.true;
    });
  });


  describe('rendering a large icon', () => {
    beforeEach(async () => {
      await mount(
        <Icon
          id="icon-id"
          icon="bookmark"
          size="large"
        />
      );
    });

    it('renders with size to be large', () => {
      expect(icon.isLarge).to.be.true;
    });
  });
});
