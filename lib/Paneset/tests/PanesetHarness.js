import React from 'react';
import Button from '../../Button';
import Paneset from '../Paneset';
import Pane from '../../Pane';

class PanesetHarness extends React.Component {
  constructor(props) {
    super(props);

    this.set = React.createRef();

    this.state = Object.assign({
      showDetailPane: true,
      showSearchPane: true,
      showModal: false,
      childStatus: [],
      container: ''
    }, props.init || {});
  }

  toggleModal = () => {
    this.setState(curState => ({
      showModal: !curState.showModal
    }));
  }

  toggleDetailPane = () => {
    this.setState(curState => ({
      showDetailPane: !curState.showDetailPane
    }));
  }

  toggleSearchPane = () => {
    this.setState(curState => ({
      showSearchPane: !curState.showSearchPane
    }));
  }

  inspect = () => {
    const container = this.set.current.getContainer();

    const childArray = [
      'searchPane', 'resultsPane', 'detailsPane'
    ];
    const childStatus = childArray.map((id) => {
      return this.set.current.isRegistered(id);
    });

    this.setState({
      childStatus,
      container: container.tagName,
    });
  }

  render() {
    const {
      showDetailPane,
      showSearchPane,
      showModal,
    } = this.state;

    return (
      <Paneset ref={this.set}>
        {showSearchPane && <Pane id="searchPane" defaultWidth="320px">SearchContent</Pane>}
        <Pane id="resultsPane" defaultWidth="fill">
          <Button onClick={this.toggleSearchPane} id="toggle-search">Toggle Search Pane</Button>
          <Button onClick={this.toggleDetailPane} id="toggle-detail">Toggle Detail Pane</Button>
          <Button onClick={this.inspect} id="inspect-children">Inspect children</Button>
          <Button onClick={this.toggleModal} id="toggle-modal">Toggle Overlapping Modal</Button>
          <span data-test-container-tag>{this.state.container}</span>
          <span data-test-child-status>
            {this.state.childStatus.map((c, i) => {
              return (<span key={i} data-test-child-item>{c.toString()}</span>);
            })}
          </span>
        </Pane>
        {showDetailPane && <Pane id="detailsPane" defaultWidth="40%">Detail Content</Pane>}
        {this.props.children}
        {showModal && (
          <div
            style={{
              position: 'absolute',
              width: '100vw',
              height: '100vh',
              top:'0',
              left: '0',
              backgroundColor: '#666'
            }}
          >
            <button type="button" onClick={this.toggleModal} id="close-modal">Close Modal</button>
          </div>
        )}
      </Paneset>
    );
  }
}

export default PanesetHarness;
