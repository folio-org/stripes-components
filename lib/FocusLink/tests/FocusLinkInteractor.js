import {
  HTML
} from '@folio/stripes-testing';

export default HTML.extend('focus link')
  .selector('[data-test-focus-link]')
  .actions({
    focus: ({ perform }) => perform(el => el.focus()),
    click: ({ perform }) => perform(el => el.click())
  });
