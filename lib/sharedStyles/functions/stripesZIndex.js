/*
  Single source-of-truth for z-indices in Stripes modules.
  If a z-index is needed on an element, define a string here that describes it
  and place in the appropriate order.

  Layers are ordered top to bottom.

  To use in CSS:
  .myComponent {
    z-index: stripesZIndex('myComponentLayerString');
  }

  Elements shouldn't share a layer string, because there should always be an explicit
  z priority between two elements. Stick to one usage per string.

*/

module.exports = function stripesZIndex(layer) {
  const layers = [
    'toast',
    'modal',
    'tetherElement',
    'timepicker',
    'calendar',
    'navDropdownMenu',
    'dropdownMenuTether',
    'currentAppBadge',
    'searchFieldWrap',
    'paneMenu',
    'searchPreviewPane',
    'searchFiltersPane',
    'searchPaneVignette',
    'searchResultsPane',
    'navButtonBadge',
    'navButtonInteractableIcon',
  ];

  const layerIndex = layers.indexOf(layer.replace(/^'(.*)'$/, '$1'));
  return (layerIndex > -1) ? (layers.length - layerIndex) : '1';
};
