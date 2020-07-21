/**
 * Link -> tests
 */

import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { HashRouter } from 'react-router-dom';
import { expect } from 'chai';
import { mount } from '../../../tests/helpers';

import LinkInteractor from './interactor';
import Link from '../Link';

describe('Link', () => {
  const link = new LinkInteractor();

  beforeEach(async () => {
    await mount(
      <Link
        id="some-id"
        href="/hello-world"
      >
        Link
      </Link>
    );
  });

  it('Should have an ID', () => {
    expect(link.id).to.equal('some-id');
  });

  describe('If rendered with a "href"-prop', () => {
    beforeEach(async () => {
      await mount(
        <Link href="/hello-world">Link</Link>
      );
    });

    it('Should render a native anchor tag', () => {
      expect(link.tagName).to.equal('a');
    });
  });

  describe('If rendered with a "to"-prop', () => {
    beforeEach(async () => {
      await mount(
        <HashRouter>
          <Link to="/hello-world">Link</Link>
        </HashRouter>
      );
    });

    it('Should render a native anchor tag', () => {
      expect(link.tagName).to.equal('a');
    });
  });
});
