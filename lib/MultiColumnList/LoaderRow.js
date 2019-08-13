import React, { Component } from 'react';
import PropTypes from 'prop-types';
import css from './MCLRenderer.css';

class LoaderRow extends Component {
  static propTypes = {
    askAmount: PropTypes.number,
    className: PropTypes.string,
    columns: PropTypes.arrayOf(PropTypes.string),
    columnWidths: PropTypes.object,
    height: PropTypes.number,
    loadMore: PropTypes.func,
    rowIndex: PropTypes.number,
    styleTop: PropTypes.number,
    visible: PropTypes.bool,
    width: PropTypes.number,
  };

  static defaultProps = {
    loadMore: () => {},
    visible: true,
  };

  componentDidMount() {
    const { loadMore, askAmount, rowIndex } = this.props;

    loadMore(askAmount, rowIndex);
  }

  componentDidUpdate() {
    const { loadMore, askAmount, rowIndex } = this.props;

    loadMore(askAmount, rowIndex);
  }

  render() {
    const { className, height, columns, visible, columnWidths, styleTop, rowIndex, width } = this.props;
    if (visible) {
      return (
        <div
          data-loader-row-index={rowIndex}
          className={css.mclLoaderRow}
          style={{ height, position: 'absolute', top: `${styleTop}px` }}
        >
          <div
            data-loader
            className={className}
            style={{ height, width }}
          >
            {
              columns.map((c, i) => {
                let style = { display: 'flex', flexBasis:'auto' };
                if (columnWidths && columnWidths[c]) {
                  style = { width: `${columnWidths[c]}px` };
                }
                return (
                  <div key={`${c}-${i}`} className={css.mclCell} style={style}>
                    <div className={css.mclRowPlaceholder} />
                  </div>
                );
              })
            }
          </div>
        </div>
      );
    }

    return null;
  }
}

export default LoaderRow;
