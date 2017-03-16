import _ from 'lodash';

const IfPermission = props =>
  (_.get(props, ['currentPerms', props.perm]) ? props.children : null);

export default IfPermission;
