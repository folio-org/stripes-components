import contains from 'dom-helpers/query/contains';

const getDefaultExceptions = () => [
  document.getElementById('OverlayContainer'),
  ...document.querySelectorAll('.tether-element'),
  document.querySelector('header'), // fix for main navigation dropdowns
];                                  // which depend on having focus when <Layer> is open.

export default function trapFocus(container, exceptions) {
  if (container && container.className !== document.activeElement.className) {
    if (!contains(container, document.activeElement)) {
      if ([...getDefaultExceptions(), ...exceptions].filter((e) => {
        if (!e) return false;
        return contains(e, document.activeElement);
      }).length === 0) {
        container.focus();
      }
    }
  }
}
