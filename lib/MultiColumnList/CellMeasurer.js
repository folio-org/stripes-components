import React from 'react';
import PropTypes from 'prop-types';

class CellMeasurer extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    columnName: PropTypes.string,
    measure: PropTypes.bool,
    onMeasure: PropTypes.func,
    rowIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    widthCache: PropTypes.object,
  }

  componentDidMount() {
    // console.log(`mounting ${this.props.rowIndex}`);
    this.measureNode();
  }

  componentDidUpdate() {
    // console.log(`updated ${this.props.rowIndex}`);
    this.measureNode();
  }

  element = React.createRef();

  measureNode = () => {
    const { widthCache, rowIndex, measure, onMeasure, columnName } = this.props;
    if (measure) {
      // console.log(`measuring ${this.props.rowIndex}`);
      if (this.element.current) {
        const width = this.element.current.offsetWidth;
        widthCache.set(rowIndex, width);
        if (onMeasure) onMeasure(rowIndex, columnName, width);
      }
    }
  };

  render() {
    return <div ref={this.element}>{this.props.children}</div>;
  }
}

export default CellMeasurer;
