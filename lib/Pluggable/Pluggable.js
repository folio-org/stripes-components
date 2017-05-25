// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React, { PropTypes } from 'react';
import { modules } from 'stripes-loader'; // eslint-disable-line

const Pluggable = props => {
  const plugins = modules.plugin || [];
  let best;

  for (name of Object.keys(plugins)) {
    const m = plugins[name];
    if (m.pluginType === props.type) {
      best = m;
      if (m.module === props.stripes.plugins[props.type]) break;
    }
  }

  if (best) {
    const Child = props.stripes.connect(best.getModule());
    return <Child {...props} />
  }

  return props.children;
};

Pluggable.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Pluggable;
