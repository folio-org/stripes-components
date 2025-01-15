import _ from 'lodash';
import queryString from 'query-string';

function removeQueryParam(param) {
  const parsed = queryString.parse(this.props.location.search);
  _.unset(parsed, param);
  this.props.history.push(`${this.props.location.pathname}?${queryString.stringify(parsed)}`);
}

export default removeQueryParam;
