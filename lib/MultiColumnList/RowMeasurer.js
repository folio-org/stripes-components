import React from 'react';
import PropTypes from 'prop-types';
import css from './MCLRenderer.css';

class RowMeasurer extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    getHeight: PropTypes.func,
    measure: PropTypes.bool,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    rowIndex: PropTypes.number,
    style: PropTypes.object,
  }

  componentDidMount() {
    this.measureNode();
  }

  componentDidUpdate() {
    this.measureNode();
  }

  handleFocus = () => {
    this.props.onFocus(this.props.rowIndex);
  }

  handleBlur = () => {
    this.props.onBlur();
  }

  element = React.createRef();

  measureNode = () => {
    const { getHeight, rowIndex, measure } = this.props;
    if (measure) {
      if (this.element.current) {
        const height = this.element.current.offsetHeight;
        getHeight(height, rowIndex);
      }
    }
  };

  render() {
    const {
      children,
      style,
      rowIndex
    } = this.props;
    return (
      <div
        key={`mcl-row-${rowIndex}`}
        ref={this.element}
        className={css.mclRowWrap}
        style={style}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      >
        {children}
      </div>
    );
  }
}

export default RowMeasurer;
