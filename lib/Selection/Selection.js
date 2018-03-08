/* API entry for single-single select and multi-select fields... basically a props pass-through. */

import React from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
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
}

const defaultProps = {
  multiple: false,
};

class Selection extends React.Component {
  constructor(props) {
    super(props);
  }

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
