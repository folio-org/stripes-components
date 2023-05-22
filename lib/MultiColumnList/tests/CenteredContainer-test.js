import React from 'react';
import { describe, beforeEach, before, it } from 'mocha';
import {
  HTML,
  including
} from '@folio/stripes-testing';
import { mount } from '../../../tests/helpers';
import CenteredContainer from '../CenteredContainer';

const CenteredInteractor = HTML.extend('centered container')
  .selector('[class^=mclCenteredContainer]')
  .filters({
    style: (el) => el.getAttribute('style')
  });

describe('CenteredContainer', () => {
  const centered = CenteredInteractor();
  beforeEach( async () => {
    await mount(
      <div style={{ width: '200px', height: '100px', overflow: 'auto' }}>
        <div style={{ width: '600px', height: '400px' }}>
          <CenteredContainer visible>
            <span data-test="test">test</span>
          </CenteredContainer>
        </div>
      </div>
    );
  });

  it('sets the correct width to the rendered element', () => centered.has({ style: including('200px') }))
});
