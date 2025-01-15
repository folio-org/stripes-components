import queryString from 'query-string';

function transitionToParams(params) {
  const location = this.props.location;
  let query = location.query;
  if (query === undefined) {
    query = queryString.parse(location.search);
  }

  const allParams = Object.assign({}, query, params);
  const keys = Object.keys(allParams);

  let url = location.pathname;
  if (keys.length) {
    url += `?${queryString.stringify(allParams)}`;
  }

  this.props.history.push(url);
}

export default transitionToParams;
