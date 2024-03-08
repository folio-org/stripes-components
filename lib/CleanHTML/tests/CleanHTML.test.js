import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { Bigtest, converge, TextArea } from '@folio/stripes-testing';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from '../../../tests/helpers';

import CleanHTMLHarness from '../stories/CleanHTML.stories';
import CleanHTML, { sanitizeMarkup } from '../CleanHTML';

const badLinkMarkup = '<a href="javascript: alert(\'yeek!\')"><strong>mischievous</strong></a>';
const cleanedLinkMarkup = '<a><strong>mischievous</strong></a>';
const goodLinkMarkup = '<a href="http://www.google.com"><strong>mischievous</strong></a>';
const badSVGMarkup = '<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" /><script type="text/javascript">alert("XSS");</script></svg>';
const cleanSVGMarkup = '<svg><rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)"></rect></svg>';
const badImgMarkup = '<img src="" onError="alert(\'xss\')" />';
const styledMarkup = '<p style="color:red;text-align:center"><u>This</u> text <em>is</em> <strong>styled</strong></p>';

describe('CleanHTML', () => {
  describe('cleaning link hrefs', () => {
    beforeEach(async () => {
      await mount(
        <CleanHTML
          markup={badLinkMarkup}
          allowLinks
          containerProps={{ id: 'clean-html-test' }}
        />
      );
    });

    it('removes offending href attribute.', () => converge(() => { if (document.getElementById('clean-html-test').innerHTML !== cleanedLinkMarkup) throw new Error(`expected innerHTML to equal ${cleanedLinkMarkup}`); }));
  });

  describe('cleaning SVG\'s with script tags', () => {
    beforeEach(async () => {
      await mount(
        <CleanHTML
          markup={badSVGMarkup}
          allowSVG
          containerProps={{ id: 'clean-html-test' }}
        />
      );
    });

    it('removes offending tags', () => converge(() => { if (document.getElementById('clean-html-test').innerHTML !== cleanSVGMarkup) throw new Error(`expected innerHTML to equal ${cleanSVGMarkup}`); }));
  });

  describe('given simple styled presentation elements', () => {
    beforeEach(async () => {
      await mount(
        <CleanHTML
          markup={styledMarkup}
          containerProps={{ id: 'clean-html-test' }}
        />
      );
    });

    it('leaves styled markup untouched', () => converge(() => { if (document.getElementById('clean-html-test').innerHTML !== styledMarkup) throw new Error(`expected "${document.getElementById('clean-html-test').innerHTML}" to equal "${styledMarkup}"`); }));
  });

  describe('sanitizeMarkup', () => {
    it('removes javascript hrefs in links', () => {
      expect(sanitizeMarkup(badLinkMarkup, { allowLinks: true })).to.equal(cleanedLinkMarkup);
    });

    it('retains valid hrefs in links', () => {
      expect(sanitizeMarkup(goodLinkMarkup, { allowLinks: true })).to.equal(goodLinkMarkup);
    });

    it('removes script tags from SVG\'s', () => {
      expect(sanitizeMarkup(badSVGMarkup, { allowSVG: true })).to.equal(cleanSVGMarkup);
    });

    it('removes js events', () => {
      expect(sanitizeMarkup(badImgMarkup)).to.equal('');
    });
  });
});
