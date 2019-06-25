import React from 'react';
import PropTypes from 'prop-types';

class CellMeasurer extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    getWidth: PropTypes.func,
    measure: PropTypes.bool,
    name: PropTypes.string,
    rowIndex: PropTypes.number,
  }

  componentDidMount() {
    this.measureNode();
  }

  componentDidUpdate() {
    this.measureNode();
  }

  element = React.createRef();

  measureNode = () => {
    const { getWidth, name, rowIndex, measure } = this.props;
    if (measure) {
      if (this.element.current) {
        const width = this.element.current.offsetWidth;
        getWidth(width, name, rowIndex);
      }
    }
  };

  render() {
    return <div ref={this.element}>{this.props.children}</div>;
  }
}

export default CellMeasurer;
