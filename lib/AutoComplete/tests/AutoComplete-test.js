import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';

import AutoComplete from '../AutoComplete';
import AutoCompleteInteractor from './interactor';

describe.only('AutoComplete', () => {
  const autoComplete = new AutoCompleteInteractor();
  const suggestions = [{ value: 'location1' }, { value: 'location2' }, { value: 'location3' }];

  describe('with an id', () => {
    beforeEach(async () => {
      await mount(
        <AutoComplete id="AutoComplete-test" suggestions={suggestions} />
      );
    });

    it('has an id on the root element', () => {
      expect(autoComplete.id).to.equal('AutoComplete-test-list');
    });
  });
});
