/**
 * TextLink -> tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { HashRouter } from 'react-router-dom';
import { runAxeTest } from '@folio/stripes-testing';
import { mount } from '../../../tests/helpers';
import { RoledHTML } from '../../../tests/helpers/localInteractors';
import TextLink from '../TextLink';

const TextLinkInteractor = RoledHTML.extend('text link')
  .selector('[data-test-text-link]');

describe('TextLink', () => {
  const textLink = TextLinkInteractor();

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

  it('contains no axe errors - TextLink', runAxeTest);

  it('Should have an ID', () => textLink.has({ id: 'some-id' }));

  describe('If rendered with a "href"-prop', () => {
    beforeEach(async () => {
      await mount(
        <TextLink href="/hello-world">TextLink</TextLink>
      );
    });

    it('Should render a native anchor tag', () => textLink.has({ tagName: 'A' }));
  });

  describe('If rendered with a "to"-prop', () => {
    beforeEach(async () => {
      await mount(
        <HashRouter>
          <TextLink to="/hello-world">TextLink</TextLink>
        </HashRouter>
      );
    });

    it('Should render a native anchor tag', () => textLink.has({ tagName: 'A' }));
  });
});
