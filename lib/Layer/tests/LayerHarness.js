import React from 'react';
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
      <>
        <div id="OverlayContainer">
          <Button id="overlayButton">Overlay Button</Button>
        </div>
        <div style={{ position: 'relative', height: '150px' }}>
          <Paneset>
            <Button onClick={() => { this.setState({ showLayer: true }); }}>show layer</Button>
            <Button onClick={() => { this.setState({ showLayer: false }); }}>hide layer</Button>
            <Layer isOpen={this.state.showLayer} {...this.props}>
              { children }
            </Layer>
          </Paneset>
        </div>
        <Button id="outsideButton">focus catcher</Button>
      </>
    );
  }
}

export default LayerHarness;
