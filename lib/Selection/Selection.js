/* API entry for single-single select and multi-select fields... basically a props pass-through. */

import React from 'react';
import PropTypes from 'prop-types';
import SingleSelect from './SingleSelect';
// import MultiSelect from './MultiSelect';

const propTypes = {
  emptyMessage: PropTypes.string,
  formatter: PropTypes.func,
  input: PropTypes.object,
  label: PropTypes.string,
  labelIsValue: PropTypes.bool,
  listMaxHeight: PropTypes.string,
  meta: PropTypes.object,
  multiple: PropTypes.bool,
  name: PropTypes.string,
  tether: PropTypes.object,
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
