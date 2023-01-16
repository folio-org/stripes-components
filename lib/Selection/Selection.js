/* API entry for single-single select and multi-select fields... basically a props pass-through. */

import React from 'react';
import PropTypes from 'prop-types';
import SingleSelect from './SingleSelect';

const propTypes = {
  emptyMessage: PropTypes.node,
  formatter: PropTypes.func,
  inputRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  label: PropTypes.node,
  labelIsValue: PropTypes.bool,
  listMaxHeight: PropTypes.string,
  name: PropTypes.string,
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
