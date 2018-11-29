const isStatefulComponent =
  component => typeof component.type !== 'string' && component.type.prototype && component.type.prototype.render;

const isStatefulComponentType =
  componentType => typeof componentType !== 'string' && componentType.prototype && componentType.prototype.render;

export {
  isStatefulComponent,
  isStatefulComponentType,
};
