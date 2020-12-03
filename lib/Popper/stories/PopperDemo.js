import React from 'react';
import PropTypes from 'prop-types';

import Button from '../../Button';

import Popper from '../Popper';

export default class PopperDemo extends React.Component {
  static propTypes = {
    hideOnOverflow: PropTypes.bool,
    portal: PropTypes.element,
  }

  state = {
    isOpen: true,
  };

  anchorRef = React.createRef();

  toggle = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  }

  renderTrigger = (ref) => {
    return (
      <Button
        buttonRef={ref}
        onClick={this.toggle}
        style={{ margin: '0px' }}
      >
        Anchor
      </Button>
    );
  }

  render() {
    const {
      portal,
      hideOnOverflow,
    } = this.props;

    return (
      <>
        <Button
          buttonRef={this.anchorRef}
          onClick={this.toggle}
          style={{ margin: '0px' }}
        >
          Anchor
        </Button>
        <Popper
          portal={portal}
          isOpen={this.state.isOpen}
          anchorRef={this.anchorRef}
          hideOnOverflow={hideOnOverflow}
        >
          <div
            style={{
              background: 'white',
              padding: '10px',
              width: '300px',
              borderRadius: '4px',
              boxShadow: '0px 0px 5px 0px grey',
              marginBottom: '0px',
            }}
          >
            Overlay
          </div>
        </Popper>
      </>
    );
  }
}
