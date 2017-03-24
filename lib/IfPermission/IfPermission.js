import _ from 'lodash';

const IfPermission = props =>
  (props.stripes.hasPerm(props.perm) ? props.children : null);

export default IfPermission;
