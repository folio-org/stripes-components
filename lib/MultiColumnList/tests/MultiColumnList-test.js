import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';

import MultiColumnList from '../MultiColumnList';
import MultiColumnListInteractor from './interactor';
import data from './data';

describe('MultiColumnList', () => {
  const mcl = new MultiColumnListInteractor();

  beforeEach(async () => {
    await mountWithContext(
      <MultiColumnList contentData={data} />
    );
  });

  it('renders the container', () => {
    expect(mcl.containerPresent).to.be.true;
  });
});
