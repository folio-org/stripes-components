// test-level interactor to check for presence of label, internal only.
import { HTML } from '@folio/stripes-testing';

export const label = HTML.extend('label-interactor')
  .selector('label');
