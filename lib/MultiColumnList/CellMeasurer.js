import React from 'react';
import PropTypes from 'prop-types';
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

  element = React.createRef();

  measureNode = () => {
    const { widthCache, rowIndex, measure, onMeasure, columnName } = this.props;
    if (measure) {
      if (this.element.current && this.element.current.offsetParent !== null) {
        const width = this.element.current.offsetWidth;
        widthCache.set(rowIndex, width);
        if (onMeasure) onMeasure(rowIndex, columnName, width);
      }
    }
  };

  render() {
    return <div ref={this.element} data-grid-id={this.props.gridId} style={{ display: 'flex' }}>{this.props.children}</div>;
  }
}

export default CellMeasurer;
