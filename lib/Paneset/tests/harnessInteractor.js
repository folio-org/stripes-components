import {
  interactor,
  text,
  Interactor,
  collection,
} from '@bigtest/interactor';

import PanesetInteractor from './interactor';

@interactor class harnessInteractor {
  toggleSearch = new Interactor('#toggle-search');
  toggleDetails = new Interactor('#toggle-detail');
  toggleWidth = new Interactor('#toggle-width');
  inspectAction = new Interactor('#inspect-children');
  containerText = text('[data-test-container-tag]');
  childrenStatus = collection('[data-test-child-item]');

  paneset = new PanesetInteractor();
}

export default harnessInteractor;
