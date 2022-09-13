import React from 'react';
import {
  describe,
  beforeEach,
  it,
} from 'mocha';
import { HTML } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';
import Popper from '../Popper';
// import PopperInteractor from './interactor';

const PopperAnchor = HTML.extend('popper anchor')
  .selector('[data-test-popper-anchor]');

const PopperInteractor = HTML.extend('popper')
  .selector('[data-test-popper-overlay]');

const RootInteractor = HTML.extend('root')
  .selector('#root');

describe('Popper', () => {
  const anchorRef = React.createRef();

  const anchor = (
    <div
      ref={anchorRef}
      data-test-popper-anchor
      style={{
        display: 'inline-block',
        padding: '10px',
        border: '1px solid',
      }}
    >
      Anchor element
    </div>
  );

  function Overlay() {
    return (
      <div
        data-test-popper-overlay
        style={{
          border: '1px solid green',
        }}
      >
        Overlay element
      </div>
    );
  }

  const popperInteractor = PopperInteractor();

  beforeEach(async () => {
    await mount(
      <div>
        {anchor}
        <Popper
          isOpen
          anchorRef={anchorRef}
        >
          <Overlay />
        </Popper>
      </div>
    );
  });

  it('should render anchor element', () => PopperAnchor().exists());

  it('should display overlay when "isOpen" prop is true', () => popperInteractor.exists());

  describe('when "isOpen" prop is false', () => {
    beforeEach(async () => {
      await mount(
        <div>
          {anchor}
          <Popper anchorRef={anchorRef}>
            <Overlay />
          </Popper>
        </div>
      );
    });

    it('should not display overlay ', () => popperInteractor.absent());
  });

  describe('when portal node is provided', () => {
    const portal = document.getElementById('root');

    beforeEach(async () => {
      await mount(
        <div>
          {anchor}
          <Popper
            isOpen
            portal={portal}
            anchorRef={anchorRef}
          >
            <Overlay />
          </Popper>
        </div>
      );
    });

    it('should render overlay in a portal ', () => RootInteractor().find(PopperInteractor()).exists());
  });
});
