import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

class CellMeasurer extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    columnName: PropTypes.string,
    shouldMeasure: PropTypes.bool,
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
    const { widthCache, rowIndex, shouldMeasure, onMeasure, columnName } = this.props;
    if (shouldMeasure) {
      const elem = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node
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
