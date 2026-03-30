// @ts-nocheck
import React, { createRef } from "react";
import PropTypes from "prop-types";
type RowMeasurerProps = {
  children?: React.ReactNode;
  className?: string;
  heightCache?: Record<string, any>;
  measure?: boolean;
  onBlur?: (...args: any[]) => any;
  onClick?: (...args: any[]) => any;
  onFocus?: (...args: any[]) => any;
  onMeasure?: (...args: any[]) => any;
  positionedRowStyle?: Record<string, any>;
  rowIndex?: number;
  staticPosition?: boolean;
};

class RowMeasurer extends React.Component<RowMeasurerProps> {
  static defaultProps = {
    onMeasure: () => {},
  };

  constructor(props) {
    super(props);
    this.element = createRef(null);
  }

  componentDidMount() {
    if (!this.props.staticPosition) this.measureNode();
  }

  componentDidUpdate() {
    if (!this.props.staticPosition) this.measureNode();
  }

  componentWillUnmount() {
    const { heightCache, rowIndex } = this.props;

    heightCache.clearRequest(rowIndex);
  }

  handleFocus = () => {
    this.props.onFocus(this.props.rowIndex);
  };

  measureNode = () => {
    const { rowIndex, heightCache, measure, onMeasure } = this.props;
    if (measure) {
      if (!heightCache.request(rowIndex)) {
        if (this.element.current === null) return;
        const elemHeight = this.element.current.offsetHeight;
        heightCache.set(rowIndex, elemHeight);
        onMeasure(elemHeight);
      }
    }
  };

  render() {
    const {
      rowIndex,
      onClick,
      className,
      onFocus,
      onBlur,
      positionedRowStyle,
    } = this.props;
    return (
      <div // eslint-disable-line
        data-row-index={`row-${rowIndex}`}
        className={className}
        aria-rowindex={rowIndex + 2}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        style={positionedRowStyle}
        role="row"
        ref={this.element}
      >
        {this.props.children}
      </div>
    );
  }
}

export default RowMeasurer;
