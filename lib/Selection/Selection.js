/* API entry for single-single select and multi-select fields... basically a props pass-through. */

import React from 'react';
import PropTypes from 'prop-types';
import SingleSelect from './SingleSelect';
/*
* coming soon! import MultiSelect from './MultiSelect';
*/

const propTypes = {
  emptyMessage: PropTypes.string,
  listMaxHeight: PropTypes.string,
  tether: PropTypes.object,
  label: PropTypes.string,
  input: PropTypes.object,
  meta: PropTypes.object,
  multiple: PropTypes.bool,
  labelIsValue: PropTypes.bool,
  formatter: PropTypes.func,
  name: PropTypes.string,
};

const defaultProps = {
  multiple: false,
};

class Selection extends React.Component {
  render() {
    return (
      <SingleSelect {...this.props} />
    );
  }
}

Selection.defaultProps = defaultProps;
Selection.propTypes = propTypes;

export default Selection;
