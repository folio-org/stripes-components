import contains from 'dom-helpers/query/contains';
import layerCss from '../lib/Layer/Layer.css';

const getDefaultExceptions = () => [
  document.getElementById('OverlayContainer'),
  ...document.querySelectorAll('.tether-element'),
  ...document.querySelectorAll(`.${layerCss.LayerRoot}`)
];

export default function trapFocus(container, exceptions = getDefaultExceptions()) {
  if (container && container.className !== document.activeElement.className) {
    if (container && !contains(container, document.activeElement)) {
      if (exceptions.filter((e) => contains(e, document.activeElement)).length === 0) {
        container.focus();
      }
    }
  }
}
