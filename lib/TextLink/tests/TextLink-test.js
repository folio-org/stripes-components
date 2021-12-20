/**
 * TextLink -> tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { HashRouter } from 'react-router-dom';
import { expect } from 'chai';
import { mount } from '../../../tests/helpers';

import TextLinkInteractor from './interactor';
import TextLink from '../TextLink';

describe('TextLink', () => {
  const textLink = new TextLinkInteractor();

  beforeEach(async () => {
    await mount(
      <TextLink
        id="some-id"
        href="/hello-world"
      >
        TextLink
      </TextLink>
    );
  });

  it('Should have an ID', () => {
    expect(textLink.id).to.equal('some-id');
  });

  describe('If rendered with a "href"-prop', () => {
    beforeEach(async () => {
      await mount(
        <TextLink href="/hello-world">TextLink</TextLink>
      );
    });

    it('Should render a native anchor tag', () => {
      expect(textLink.tagName).to.equal('a');
    });
  });

  describe('If rendered with a "to"-prop', () => {
    beforeEach(async () => {
      await mount(
        <HashRouter>
          <TextLink to="/hello-world">TextLink</TextLink>
        </HashRouter>
      );
    });

    it('Should render a native anchor tag', () => {
      expect(textLink.tagName).to.equal('a');
    });
  });
});
