import { expect } from 'chai';
import { describe, it } from 'mocha';
import { sanitizeHtml, defaultSanitizeConfig } from '../sanitizeHtml';

describe('sanitizeHtml', () => {
  it('returns non-strings unchanged', () => {
    expect(sanitizeHtml(undefined)).to.equal(undefined);
    expect(sanitizeHtml(null)).to.equal(null);
  });

  it('leaves clean editor markup untouched', () => {
    const html = '<p class="ql-indent-1"><strong>bold</strong> <em>it</em></p><ul><li>one</li></ul>';
    expect(sanitizeHtml(html)).to.equal(html);
  });

  describe('interactive and active elements', () => {
    ['button', 'form', 'select', 'textarea', 'style', 'iframe', 'svg', 'math'].forEach(tag => {
      it(`removes <${tag}>`, () => {
        const out = sanitizeHtml(`<p>hi</p><${tag}>x</${tag}>`);
        expect(out).to.not.include(`<${tag}`);
      });
    });

    it('removes <input> and <script>', () => {
      const out = sanitizeHtml('<input value="x"><script>alert(1)</script><p>ok</p>');
      expect(out).to.equal('<p>ok</p>');
    });
  });

  describe('attributes', () => {
    it('strips event handlers from allowed tags', () => {
      const out = sanitizeHtml('<p onmouseover="x()">t</p><a href="https://a.b" onclick="x()">l</a>');
      expect(out).to.not.match(/onmouseover|onclick/);
      expect(out).to.include('href="https://a.b"');
    });

    it('drops data-* attributes', () => {
      expect(sanitizeHtml('<p data-x="1">t</p>')).to.equal('<p>t</p>');
    });
  });

  describe('style attribute', () => {
    it('keeps allowlisted properties with safe values', () => {
      const html = '<span style="color: rgb(230, 0, 0); background-color: #ff0">t</span>';
      expect(sanitizeHtml(html)).to.equal(html);
    });

    it('drops disallowed properties but keeps the rest', () => {
      const out = sanitizeHtml('<p style="color: red; position: fixed; top: 0">t</p>');
      expect(out).to.equal('<p style="color: red">t</p>');
    });

    it('drops url(), expression() and escaped values', () => {
      expect(sanitizeHtml('<p style="color: red; background-color: url(https://x.test/a.png)">t</p>')).to.equal('<p style="color: red">t</p>');
      expect(sanitizeHtml('<p style="color: expression(alert(1))">t</p>')).to.equal('<p>t</p>');
      expect(sanitizeHtml('<p style="color: \\72 ed">t</p>')).to.equal('<p>t</p>');
      expect(sanitizeHtml('<p style="font-family: x; color: red/*">t</p>')).to.equal('<p style="font-family: x">t</p>');
    });

    it('removes the attribute when nothing safe remains', () => {
      expect(sanitizeHtml('<p style="position: absolute">t</p>')).to.equal('<p>t</p>');
    });

    it('can still be forbidden by a consumer', () => {
      expect(sanitizeHtml('<p style="color: red">t</p>', { FORBID_ATTR: ['style'] })).to.equal('<p>t</p>');
    });
  });

  describe('images', () => {
    it('keeps a normal image', () => {
      const html = '<img src="https://x.test/y.png" alt="a">';
      expect(sanitizeHtml(html)).to.equal(html);
    });

    it('keeps the image but drops onerror/onload/srcset', () => {
      const out = sanitizeHtml('<img src="https://x.test/y.png" onerror="alert(1)" onload="a()" srcset="b 2x">');
      expect(out).to.include('<img');
      expect(out).to.not.match(/onerror|onload|srcset/);
    });

    it('drops svg data URIs and javascript: sources', () => {
      expect(sanitizeHtml('<img src="data:image/svg+xml;base64,AAAA">')).to.not.include('src=');
      expect(sanitizeHtml('<img src="javascript:alert(1)">')).to.not.include('javascript');
    });
  });

  describe('links', () => {
    it('neutralizes javascript: and data: hrefs', () => {
      expect(sanitizeHtml('<a href="javascript:alert(1)">x</a>')).to.not.include('javascript');
      expect(sanitizeHtml('<a href="jav&#x09;ascript:alert(1)">x</a>')).to.not.include('ascript:');
      expect(sanitizeHtml('<a href="data:text/html,<script>alert(1)</script>">x</a>')).to.not.include('data:');
    });

    it('adds rel="noopener noreferrer" to target=_blank links', () => {
      const out = sanitizeHtml('<a href="https://a.b" target="_blank">x</a>');
      expect(out).to.include('target="_blank"');
      expect(out).to.include('rel="noopener noreferrer"');
    });

    it('removes unsupported target values', () => {
      expect(sanitizeHtml('<a href="https://a.b" target="evilframe">x</a>')).to.not.include('target');
    });
  });

  describe('overrides', () => {
    it('exports a config containing the defaults', () => {
      expect(defaultSanitizeConfig.ALLOWED_TAGS).to.include('a');
      expect(defaultSanitizeConfig.FORBID_TAGS).to.include('script');
    });

    it('allows widening with safe tags and attributes', () => {
      const out = sanitizeHtml('<p data-x="1"><mark>t</mark></p>', { ADD_TAGS: ['mark'], ADD_ATTR: ['data-x'], ALLOW_DATA_ATTR: true });
      expect(out).to.include('<mark>');
      expect(out).to.include('data-x="1"');
    });

    it('cannot re-enable forbidden elements', () => {
      const out = sanitizeHtml('<form><button>b</button></form><script>1</script>', {
        ALLOWED_TAGS: ['form', 'button', 'script'],
        ADD_TAGS: ['form', 'script'],
        FORBID_TAGS: [],
      });
      expect(out).to.not.match(/<form|<button|<script/);
    });

    it('cannot re-enable forbidden attributes', () => {
      const out = sanitizeHtml('<p srcset="x">t</p>', { ADD_ATTR: ['srcset'], FORBID_ATTR: [] });
      expect(out).to.not.include('srcset');
    });
  });
});
