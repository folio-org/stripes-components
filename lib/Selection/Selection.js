/* API entry for single-single select and multi-select fields... basically a props pass-through. */

import React from 'react';
import PropTypes from 'prop-types';
import SingleSelect from './SingleSelect';
import MultiSelect from './MultiSelect';

const propTypes = {
  emptyMessage: PropTypes.string,
  listMaxHeight: PropTypes.string,
  tether: PropTypes.object,
  label: PropTypes.string,
  input: PropTypes.object,
  meta: PropTypes.object,
  multiple: PropTypes.bool,
  labelIsValue: PropTypes.bool,
};

const defaultProps = {
  multiple: false,
};

class Selection extends React.Component {
  render() {
    if (!this.props.multiple) {
      return (
        <SingleSelect {...this.props} />
      );
    } else {
      return (
        <MultiSelect {...this.props} />
      );
    }
  }
}

Selection.defaultProps = defaultProps;
Selection.propTypes = propTypes;

export default Selection;
