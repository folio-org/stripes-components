import {
  interactor,
  collection,
  Interactor,
  scoped
} from '@bigtest/interactor';

import paneInteractor from '../../Pane/tests/interactor';
import css from '../Paneset.css';
import paneCss from '../../Pane/Pane.css';
import resizeCss from '../PaneResize.css';
import { computedStyle } from '../../../tests/helpers';

export const ResizeInteractor = interactor(class ResizeInteractor {
  static defaultScope = `.${resizeCss.container}`;
  handles = collection(`.${resizeCss.handle}`);
  cursorPos = computedStyle(`.${resizeCss.cursor}`, 'left');
  cursor = scoped(`.${resizeCss.cursor}`);

  dragTo(index, x) {
    return this.handles(index)
      .trigger('mousedown')
      .do(() => {
        const mevent = new MouseEvent('mousemove', { clientX: x });
        document.dispatchEvent(mevent);
      })
      .do(() => {
        const upEvent = new MouseEvent('mouseup');
        document.dispatchEvent(upEvent);
      });
  }
});

export default interactor(class PaneSetInteractor {
  static defaultScope = `.${css.paneset}`;
  panes = collection(`.${paneCss.pane}`, paneInteractor);
  testElement = new Interactor('[data-test]');
});
