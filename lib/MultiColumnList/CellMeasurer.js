import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

class CellMeasurer extends React.PureComponent {
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
      const elem = ReactDOM.findDOMNode(this);
      if (elem && elem.offsetParent !== null) {
        const width = elem.offsetWidth;
        widthCache.set(rowIndex, width);
        if (onMeasure) onMeasure(rowIndex, columnName, width);
      }
    }
  };

  render() {
    return this.props.children;
  }
}

export default CellMeasurer;
