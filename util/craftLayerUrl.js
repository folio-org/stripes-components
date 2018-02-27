import _ from 'lodash';
import queryString from 'query-string';

function craftLayerUrl(mode) {
  const url = this.props.location.pathname + this.props.location.search;
  return _.includes(url, '?') ? `${url}&layer=${mode}` : `${url}?layer=${mode}`;
}

export default craftLayerUrl;
