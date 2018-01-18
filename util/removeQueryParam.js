import _ from 'lodash';
import queryString from 'query-string';

function removeQueryParam(param) {
  const parsed = queryString.parse(this.props.locaction.search);
  _.unset(parsed, param);
  this.props.history.push(`${this.props.locaction.pathname}?${queryString.stringify(parsed)}`);
}

export default removeQueryParam;