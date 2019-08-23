import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import css from './MCLRenderer.css';

class RowMeasurer extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    gridId: PropTypes.string,
    heightCache: PropTypes.object,
    measure: PropTypes.bool,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onMeasure: PropTypes.func,
    rowIndex: PropTypes.number,
    staticPosition: PropTypes.bool,
    style: PropTypes.object,
  }

  static defaultProps = {
    onMeasure: () => {}
  }

  componentDidMount() {
    if (!this.props.staticPosition) this.measureNode();
  }

  componentDidUpdate() {
    if (!this.props.staticPosition) this.measureNode();
  }

  componentWillUnmount() {
    const {
      heightCache,
      rowIndex,
    } = this.props;

    heightCache.clearRequest(rowIndex);
  }

  handleFocus = () => {
    this.props.onFocus(this.props.rowIndex);
  }

  measureNode = () => {
    const { rowIndex, heightCache, measure, onMeasure } = this.props;
    if (measure) {
      if (!heightCache.request(rowIndex)) {
        // findDOMNode is more dependable here than using refs.
        const elem = findDOMNode(this); // eslint-disable-line
        // container is visibly hidden. No measurement
        if (elem.offsetParent === null) return;
        const elemHeight = elem.offsetHeight;
        heightCache.set(rowIndex, elemHeight);
        onMeasure(elemHeight);
      }
    }
  }

  render() {
    return this.props.children;
  }
}

export default RowMeasurer;
