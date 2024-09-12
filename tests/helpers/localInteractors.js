// test-level interactor to check for presence of label, internal only.
import { HTML } from '@folio/stripes-testing';

export const label = HTML.extend('label-interactor')
  .selector('label');

export const RoledHTML = HTML.extend('html plus')
  .filters({
    role: element => element.getAttribute('role'),
    tagName: el => el.tagName,
    inert: el => el.inert
  });
