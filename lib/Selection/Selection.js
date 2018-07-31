/* API entry for single-single select and multi-select fields... basically a props pass-through. */

import React from 'react';
import PropTypes from 'prop-types';
import SingleSelect from './SingleSelect';

const propTypes = {
  emptyMessage: PropTypes.string,
  formatter: PropTypes.func,
  input: PropTypes.object,
  label: PropTypes.string,
  labelIsValue: PropTypes.bool,
  listMaxHeight: PropTypes.string,
  meta: PropTypes.object,
  name: PropTypes.string,
  tether: PropTypes.object,
};

class Selection extends React.Component {
  render() {
    return (
      <SingleSelect {...this.props} />
    );
  }
}

Selection.propTypes = propTypes;

export default Selection;
