function transitionToParams(params) {
  const location = this.props.location;
  const allParams = Object.assign({}, location.query, params);
  const keys = Object.keys(allParams);

  let url = location.pathname;
  if (keys.length) {
    url += `?${keys.map(key => `${key}=${encodeURIComponent(allParams[key])}`).join('&')}`;
  }

  this.context.router.transitionTo(url);
}

export default transitionToParams;
