import React from 'react';
import PropTypes from 'prop-types';
import { modules } from 'stripes-loader'; // eslint-disable-line

const Pluggable = (props, context) => {
  const plugins = modules.plugin || [];
  let best;

  const wanted = context.stripes.plugins[props.type];
  // "@@" is a special case of explicitly chosen "no plugin"
  if (!wanted || wanted !== '@@') {
    for (const name of Object.keys(plugins)) {
      const m = plugins[name];
      if (m.pluginType === props.type) {
        best = m;
        if (m.module === wanted) break;
      }
    }

    if (best) {
      const Child = context.stripes.connect(best.getModule());
      return <Child {...props} />;
    }
  }

  if (props.children.length) {
    console.error(`<Pluggable type="${props.type}"> has ${props.children.length} children, can only return one`);
  }
  return props.children;
};

Pluggable.contextTypes = {
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
};

Pluggable.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default Pluggable;
