import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import { mount } from '../../../tests/helpers';
import getScrollParent from '../getScrollParent';

describe('getScrollParent', () => {
  beforeEach(async () => {
    await mount(
      <div id="outer" style={{ position: 'relative', overflowX: 'auto', height: '100px', width: '100px' }}>
        <div id="nondescript">
          <div id="inner" style={{ overflow: 'auto', height: '300px', width: '300px' }}>
            <div id="hidden" style={{ overflow: 'hidden', height: '300px', width: '300px' }}>
              <div id="deepChild">
                test
                <div id="absoluteChild" style={{ position: 'absolute', top: '0', left: '0' }}>
                  overlay test
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="fixedTest" style={{ position: 'fixed', height: '50px', width: '300px' }}>fixed test</div>
      </div>
    )
  });

  it('given the deep element, returns the inner element', () => {
    const el = document.getElementById('deepChild');
    expect(getScrollParent(el).id).to.equal('inner');
  });

  it('given the deep element with second includeHiddenOverflow parameter, returns the overflow:hidden element', () => {
    const el = document.getElementById('deepChild');
    expect(getScrollParent(el).id).to.equal('inner');
  });

  it('given the inner element, returns the outer element', () => {
    const el = document.getElementById('inner');
    expect(getScrollParent(el).id).to.equal('outer');
  });

  it('given the outer element, returns the document.body', () => {
    const el = document.getElementById('outer');
    expect(getScrollParent(el)).to.equal(document.body);
  });

  it('given the fixed element, returns the document.body', () => {
    const el = document.getElementById('fixedTest');
    expect(getScrollParent(el)).to.equal(document.body);
  });

  it('given the deep absolutely positioned element, returns the relatively positioned outer element (skipping the staticly positioned inner)', () => {
    const el = document.getElementById('absoluteChild');
    expect(getScrollParent(el).id).to.equal('outer');
  });
});
