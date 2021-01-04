import {
  interactor,
  triggerable,
} from '@bigtest/interactor';

const KeyboardInteractor = interactor(class KeyboardInteractor {
  focus() {
    this.$root.focus();
  }

  pressCtrl = triggerable('keydown', { keyCode: 17 });
  pressAlt = triggerable('keydown', { keyCode: 18 });
  expandAll = triggerable('keydown', { key: 'b', keyCode: 66, ctrlKey: true, altKey: true });
  collapseAll = triggerable('keydown', { key: 'g', keyCode: 71, ctrlKey: true, altKey: true });
});

export default KeyboardInteractor;
