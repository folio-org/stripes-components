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
    const { children } = this.props;
    return (
      <Fragment>
        <div id="OverlayContainer">
          <Button data-test-overlay-action onClick={() => {console.log('overlay click!');}}>Overlay Button</Button>
        </div>
        <Paneset>
          <Button data-test-show-layer onClick={() => { this.setState({ showLayer: true }); }}>show layer</Button>
          <Button data-test-hide-layer onClick={() => { this.setState({ showLayer: false }); }}>hide layer</Button>
          <Layer isOpen={this.state.showLayer} {...this.props}>
            { children }
          </Layer>
        </Paneset>
        <Button data-test-focus-catcher>focus catcher</Button>
      </Fragment>
    );
  }
}

export default LayerHarness;
