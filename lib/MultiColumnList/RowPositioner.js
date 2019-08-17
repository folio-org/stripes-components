import React from 'react';
import PropTypes from 'prop-types';

class RowPositioner extends React.Component {
  static propTypes = {
    averageHeight: PropTypes.number,
    children: PropTypes.func.isRequired,
    gridId: PropTypes.string, // eslint-disable-line
    heightCache: PropTypes.object.isRequired,
    onPosition: PropTypes.func,
    onUnmount: PropTypes.func,
    positionCache: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
    shouldPosition: PropTypes.bool,
  }

  static defaultProps = {
    onPosition: () => {},
    onUnmount: () => {},
    shouldPosition: true,
  }

  constructor(props) {
    super(props);
    const { positionCache, rowIndex, averageHeight, shouldPosition } = props;

    let position = null;
    if (shouldPosition) {
      if (positionCache) {
        position = positionCache.request(rowIndex);
      }

      if (position !== null) {
        props.onPosition(position, rowIndex);
      }
    }

    this.state = {
      rowIndex,
      position,
      averageHeight // eslint-disable-line react/no-unused-state
    };
  }

  static getDerivedStateFromProps(props, state) {
    const {
      rowIndex,
      heightCache,
      averageHeight,
      shouldPosition
    } = props;

    const newState = {};
    if ((state.rowIndex !== rowIndex) || (state.averageHeight !== averageHeight)) {
      newState.rowIndex = rowIndex;
      if (shouldPosition) {
        newState.position = heightCache.requestAccumulated(rowIndex, null);
      }
    }

    return newState;
  }

  // if we weren't able to obtain position in the constructor,
  // request an accumulated position from the cache of rowHeights.
  // we do this after mounting so that a state will exist to be set via a setState call.
  componentDidMount() {
    const { heightCache, rowIndex } = this.props;
    if (this.state.position === null) {
      heightCache.requestAccumulated(rowIndex, this.cachePosition);
    }
  }

  componentWillUnmount() {
    const {
      heightCache,
      rowIndex
    } = this.props;

    heightCache.clearAccumRequest(rowIndex);
    this.props.onUnmount(this.state.position);
  }

  // once our top style is calculated, store it in the style cache and apply it to
  // our state.
  cachePosition = (cacheResult) => {
    const { positionCache, rowIndex, onPosition } = this.props;
    const { result, estimate } = cacheResult;
    if (!estimate) {
      // console.log(`storing position of row ${rowIndex}`);
      if (positionCache) {
        positionCache.set(rowIndex, result);
      }
    }
    onPosition(cacheResult, rowIndex);
    this.setState({ position: result });
  }

  render() {
    const { children } = this.props;
    const { rowIndex, position } = this.state;
    return children({ localRowIndex: rowIndex, position });
  }
}

export default RowPositioner;
