/**
 * Link -> tests
 */

import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { mount } from '../../../tests/helpers';

import LinkInteractor from './interactor';
import Link from '../Link';

describe('Link', () => {
  const link = new LinkInteractor();

  beforeEach(async () => {
    await mount(
      <Link>Click me</Link>
    );
  });
});
