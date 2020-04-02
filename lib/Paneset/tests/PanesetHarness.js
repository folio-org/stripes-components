import React from 'react';
import Button from '../../Button';
import Paneset from '../Paneset';
import Pane from '../../Pane';

class PanesetHarness extends React.Component {
  constructor(props) {
    super(props);

    this.set = React.createRef();

    this.state = {
      showDetailPane: true,
      showSearchPane: true,
      childStatus: [],
      container: ''
    };
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
    } = this.state;

    return (
      <Paneset ref={this.set}>
        {showSearchPane && <Pane id="searchPane" defaultWidth="320px">SearchContent</Pane>}
        <Pane id="resultsPane" defaultWidth="fill">
          <Button onClick={this.toggleSearchPane} id="toggle-search">Toggle Search Pane</Button>
          <Button onClick={this.toggleDetailPane} id="toggle-detail">Toggle Detail Pane</Button>
          <Button onClick={this.inspect} id="inspect-children">Inspect children</Button>
          <span data-test-container-tag>{this.state.container}</span>
          <span data-test-child-status>
            {this.state.childStatus.map((c, i) => {
              return (<span key={i} data-test-child-item>{c.toString()}</span>);
            })}
          </span>
        </Pane>
        {showDetailPane && <Pane id="detailsPane" defaultWidth="40%">Detail Content</Pane>}
        {this.props.children}
      </Paneset>
    );
  }
}

export default PanesetHarness;
