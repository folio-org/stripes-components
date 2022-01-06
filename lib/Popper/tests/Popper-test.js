import React from 'react';
import {
  describe,
  beforeEach,
  it,
} from 'mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';
import Popper from '../Popper';
import PopperInteractor from './interactor';

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

  const popperInteractor = new PopperInteractor();

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

  it('should render anchor element', () => {
    expect(popperInteractor.isDisplayAnchor).to.be.true;
  });

  it('should display overlay when "isOpen" prop is true', () => {
    expect(popperInteractor.isDisplayOverlay).to.be.true;
  });

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

    it('should not display overlay ', () => {
      expect(popperInteractor.isDisplayOverlay).to.be.false;
    });
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

    it('should render overlay in a portal ', () => {
      expect(document.querySelector('#root [data-test-popper-overlay]')).to.exist;
    });
  });
});
