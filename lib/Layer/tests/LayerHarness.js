import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Layer from '../Layer';
import Button from '../../Button';
import Paneset from '../../Paneset';

class LayerHarness extends React.Component {
  static propTypes = {
    container: PropTypes.node,
  }

  state = {
    showLayer: false,
  }

  render() {
    return (
      <Fragment>
        <div id="OverlayContainer" />
        <Paneset>
          <Button data-test-show-layer onClick={() => { this.setState({ showLayer: true }); }}>show layer</Button>
          <Button data-test-hide-layer onClick={() => { this.setState({ showLayer: false }); }}>hide layer</Button>
          <Layer isOpen={this.state.showLayer} {...this.props}>
            <div id="layerTestContent">Layer Content</div>
          </Layer>
        </Paneset>
      </Fragment>
    );
  }
}

export default LayerHarness;
