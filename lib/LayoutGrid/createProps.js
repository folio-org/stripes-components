export default function createProps(propTypes, props, classNames) {
  const newProps = {};

  Object.keys(props)
    .forEach(key => {
      if (key === 'children' || !propTypes[key]) {
        newProps[key] = props[key];
      }
    });

  const className = classNames.filter(cn => cn).join(' ');
  return Object.assign({}, newProps, { className });
}
