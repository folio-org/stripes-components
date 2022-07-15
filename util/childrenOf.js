/*
* `childrenOf` proptype that can be set for expecting a Component
* with a particular displayName.
*
* This is only necessary where we want to limit the range of
* a propType to a certain Component or set of Components.. ie. a
* string or a `<FormattedMessage>` and the range allowed by `PropTypes.node`
* is too wide.
*/
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function requirable(predicate) {
  const propType = (props, propName, ...rest) => {
    // don't do any validation if empty
    if (props[propName] === undefined) {
      return null;
    }

    return predicate(props, propName, ...rest);
  };

  propType.isRequired = (props, propName, componentName, ...rest) => {
    // warn if empty
    if (props[propName] === undefined) {
      return new Error(`Required prop \`${propName}\` was not specified in \`${componentName}\`.`);
    }

    return predicate(props, propName, componentName, ...rest);
  };

  return propType;
}

export default function childrenOf(...types) {
  return requirable((props, propName, componentName, location = 'prop', propFullName = propName) => {
    const component = props[propName];

    const check = c => types.some(type => type === c.type);
    const valid = Array.isArray(component) ? component.every(check) : check(component);
    if (!valid) {
      return new Error(
        // eslint-disable-next-line
        `Invalid ${location} \`${propFullName}\` supplied to \`${componentName}\`. Every element must be a <${types.map(t => getDisplayName(t)).join('|')}>.`
      );
    }
    return null;
  });
}
