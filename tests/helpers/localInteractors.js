// test-level interactor to check for presence of label, internal only.
import { HTML } from '@folio/stripes-testing';

// eslint-disable-next-line import/prefer-default-export
export const label = HTML.extend('label-interactor').selector('label');
