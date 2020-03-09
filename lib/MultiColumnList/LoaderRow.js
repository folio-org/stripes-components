import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import css from './MCLRenderer.css';

class LoaderRow extends PureComponent {
  static propTypes = {
    askAmount: PropTypes.number,
    className: PropTypes.string,
    columns: PropTypes.arrayOf(PropTypes.string),
    columnWidths: PropTypes.object,
    height: PropTypes.number,
    loadMore: PropTypes.func,
    minWidth: PropTypes.number,
    rowIndex: PropTypes.number,
    styleTop: PropTypes.number,
    visible: PropTypes.bool,
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
    const { className, height, columns, visible, columnWidths, styleTop, rowIndex, minWidth } = this.props;
    if (visible) {
      return (
        <div
          data-loader-row-index={rowIndex}
          className={css.mclLoaderRow}
          style={{ height, top: `${styleTop}px` }}
        >
          <div
            data-loader
            className={className}
            style={{ height, minWidth }}
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
