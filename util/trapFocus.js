import contains from 'dom-helpers/query/contains';

const getDefaultExceptions = () => [
  document.getElementById('OverlayContainer'),
  ...document.querySelectorAll('.tether-element'),
];

export default function trapFocus(container, exceptions = getDefaultExceptions()) {
  if (container && !contains(container, document.activeElement)) {
    if (exceptions.filter((e) => contains(e, document.activeElement)).length === 0) {
      container.focus();
    }
  }
}
