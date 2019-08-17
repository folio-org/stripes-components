import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import noop from 'lodash/noop';

class CellMeasurer extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    columnName: PropTypes.string,
    gridId: PropTypes.string,
    measure: PropTypes.bool,
    onMeasure: PropTypes.func,
    rowIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    widthCache: PropTypes.object,
  }

  static defaultProps = {
    onMeasure: noop
  }

  componentDidMount() {
    this.measureNode();
  }

  componentDidUpdate() {
    this.measureNode();
  }

  measureNode = () => {
    const { widthCache, rowIndex, measure, onMeasure, columnName } = this.props;
    if (measure) {
      const node = findDOMNode(this);
      if (node && node.offsetParent !== null) {
        const width = node.offsetWidth;
        widthCache.set(rowIndex, width);
        if (onMeasure) onMeasure(rowIndex, columnName, width);
      }
    }
  };

  render() {
    return <div data-grid-id={this.props.gridId}>{this.props.children}</div>;
  }
}

export default CellMeasurer;
