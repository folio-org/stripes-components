import { includes } from 'lodash';

function craftLayerUrl(mode) {
  console.warn(
    '\nWarning: craftLayerUrl() is deprecated and will be removed in the\n' +
         'next major version of @folio/stripes-components.\n\n' +
         '<SearchAndSort> now has its own craftLayerUrl().\n'
  );
  const url = this.props.location.pathname + this.props.location.search;
  return includes(url, '?') ? `${url}&layer=${mode}` : `${url}?layer=${mode}`;
}

export default craftLayerUrl;
