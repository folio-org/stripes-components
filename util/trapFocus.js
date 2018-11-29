import contains from 'dom-helpers/query/contains';

const getDefaultExceptions = () => [
  document.getElementById('OverlayContainer'),
  ...document.querySelectorAll('.tether-element'),
];

export default function trapFocus(container, exceptions) {
  if (container && container.className !== document.activeElement.className) {
    if (!contains(container, document.activeElement)) {
      if ([...getDefaultExceptions(), ...exceptions].filter((e) => contains(e, document.activeElement)).length === 0) {
        container.focus();
      }
    }
  }
}
