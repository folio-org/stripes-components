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
    index: PropTypes.number,
    loadMore: PropTypes.func,
    styleTop: PropTypes.number,
    visible: PropTypes.bool,
  };

  static defaultProps = {
    loadMore: () => {},
    visible: true,
  };

  componentDidMount() {
    const { loadMore, askAmount, index } = this.props;

    loadMore(askAmount, index);
  }

  componentDidUpdate() {
    const { loadMore, askAmount, index } = this.props;

    loadMore(askAmount, index);
  }

  render() {
    const { className, height, columns, visible, columnWidths, styleTop } = this.props;
    if (visible) {
      return (
        <div
          data-loader
          className={className}
          style={{ height, position: 'absolute', top: `${styleTop}px` }}
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
      );
    }

    return null;
  }
}

export default LoaderRow;
