/**
 * Given a props object and the prop-types object for a component, separate
 * the props into two objects, one containing those props that are defined
 * for the component and the other containing everything else. This makes
 * it easy to separate the props that apply to a component from those that
 * should be passed along to a child component or element.
 *
 */
export default function separateComponentProps(props, propTypes) {
  const eProps = {};
  const cProps = {};

  Object.entries(props).forEach(([propName, propValue]) => {
    if (propName in propTypes) {
      cProps[propName] = propValue;
    } else {
      eProps[propName] = propValue;
    }
  });

  return [cProps, eProps];
}
