import _ from 'lodash';

function craftLayerUrl(mode) {
  const url = this.props.location.pathname + this.props.location.search;
  return _.includes(url, '?') ? `${url}&layer=${mode}` : `${url}?layer=${mode}`;
}

export default craftLayerUrl;
