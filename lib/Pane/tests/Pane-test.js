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

describe('Dismissible pane', () => {
  const pane = new PaneInteractor();

  beforeEach(async () => {
    await mountWithContext(
      <Paneset>
        <Pane
          defaultWidth="fill"
          dismissible
        />
      </Paneset>
    );
  });

  it('renders', () => {
    expect(pane.isPresent).to.be.true;
  });
});

describe('Testable pane', () => {
  const pane = new PaneInteractor();

  beforeEach(async () => {
    await mountWithContext(
      <Paneset>
        <Pane
          defaultWidth="fill"
          dataTest="foo"
        />
      </Paneset>
    );
  });

  it('contains the "data-test" attribute', () => {
    expect(pane.dataTest).to.equal('foo');
  });
});
