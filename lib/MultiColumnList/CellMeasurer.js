import React, { createRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

class CellMeasurer extends React.Component {
  static propTypes = {
    children: PropTypes.func,
    columnName: PropTypes.string,
    onMeasure: PropTypes.func,
    rowIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    shouldMeasure: PropTypes.bool,
    widthCache: PropTypes.object,
  }

  static defaultProps = {
    onMeasure: noop
  }

  constructor(props) {
    super(props);
    this.element = createRef(null);
  }

  componentDidMount() {
    this.measureNode();
  }

  componentDidUpdate() {
    this.measureNode();
  }

  measureNode = () => {
    const { widthCache, rowIndex, shouldMeasure, onMeasure, columnName } = this.props;
    if (shouldMeasure) {
      // const elem = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node
      if (this.element.current && this.element.current.offsetParent !== null) {
        const width = this.element.current.offsetWidth;
        widthCache.set(rowIndex, width);
        if (onMeasure) onMeasure(rowIndex, columnName, width);
      }
    }
  };

  render() {
    const { children } = this.props;

    if (typeof children === 'function') {
      return children(this.element);
    }

    return null;
  }
}

export default CellMeasurer;
