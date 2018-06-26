import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';

import Paneset from '../../Paneset';
import Pane from '../Pane';
import PaneInteractor from './interactor';

describe('Pane', () => {
  const pane = new PaneInteractor();

  beforeEach(async () => {
    await mountWithContext(
      <Paneset>
        <Pane defaultWidth="fill" />
      </Paneset>
    );
  });

  it('renders the pane', () => {
    expect(pane.isPresent).to.be.true;
  });
});
