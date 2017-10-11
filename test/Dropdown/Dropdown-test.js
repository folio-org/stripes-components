import React from 'react';
import { Dropdown, UncontrolledDropdown } from '../../lib/Dropdown';
import Button from '../../lib/Button';
import DropdownMenu from '../../lib/DropdownMenu';
import { configKeyEvent } from '../eventHelpers';

const CustomMenu = props => (<div className="custom-menu"> {props.children}</div>);

describe('Dropdown', () => {
  const onToggleAddMovie = spy();
  const dropdownMenuChildren = [
    <ul key="0">
      <li><a>A New Hope</a></li>
      <li><a>Empire Strikes Back</a></li>
      <li><a>Return of Jedi</a></li>
      <li><a>The Phantom Menace</a></li>
      <li><a>Attack of Clones</a></li>
      <li><a>Revenge Of Sith</a></li>
    </ul>,
  ];
  spy(Dropdown.prototype, 'handleKeyDown');
  spy(Dropdown.prototype, 'handleToggle');
  it('should render the dropdown and all the props', () => {
    const wrapper = shallow(
      <Dropdown id="uniqueId" open={false} onToggle={onToggleAddMovie}>
        <Button align="end" bottomMargin0 data-role="toggle" aria-haspopup="true">&#43; Pick your Fav movie</Button>
        <DropdownMenu
          data-role="menu"
          aria-label="available flicks"
          onToggle={onToggleAddMovie}
        >
          {dropdownMenuChildren}
        </DropdownMenu>
      </Dropdown>);
    expect(wrapper.type()).to.eql('div');
    expect(wrapper.props().id).to.eql('uniqueId');
    expect(wrapper.props().children.props.renderElementTo).to.eql(null);
  });

  it('should change attachment postion with tether options ', () => {
    const tether = {
      attachment: 'top right',
      classPrefix: 'flicks',
    };
    const wrapper = shallow(
      <Dropdown tether={tether} id="UniqueId" open={false} onToggle={onToggleAddMovie}>
        <Button align="end" bottomMargin0 data-role="toggle" aria-haspopup="true">&#43; Pick your Fav movie</Button>
        <DropdownMenu
          data-role="menu"
          aria-label="available flicks"
          onToggle={onToggleAddMovie}
        >
          {dropdownMenuChildren}
        </DropdownMenu>
      </Dropdown>);
    expect(wrapper.type()).to.eql('div');
    expect(wrapper.props().id).to.eql('UniqueId');
    expect(wrapper.props().children.props.attachment).to.eql('top right');
  });

  it('should toggle open/closed', () => {
    const tether = {
      attachment: 'top right',
      classPrefix: 'flicks',
    };
    const wrapper = shallow(
      <Dropdown tether={tether} id="UniqueId" open={false} onToggle={onToggleAddMovie}>
        <Button align="end" bottomMargin0 data-role="toggle" aria-haspopup="true">&#43; Pick your Fav movie</Button>
        <DropdownMenu
          data-role="menu"
          aria-label="available flicks"
          onToggle={onToggleAddMovie}
        >
          {dropdownMenuChildren}
        </DropdownMenu>
      </Dropdown>);
    expect(Dropdown.prototype.handleToggle.calledOnce).to.equal(false);
    wrapper.children().find('Button').simulate('click');
    expect(Dropdown.prototype.handleToggle.calledOnce).to.equal(true);
    wrapper.children().find('Button').simulate('click');
    expect(Dropdown.prototype.handleToggle.calledTwice).to.equal(true);
  });

  it('should toggle open/closed with explicit component', () => {
    class OpenProp extends React.Component {
      constructor(props) {
        super(props);

        this.state = {
          open: false,
        };
      }
      render() {
        return (
          <div>
            <Dropdown
              open={this.state.open}
              onToggle={() => this.setState({ open: !this.state.open })}
              title="Prop open control"
              id="test-id"
            >
              <Button align="end" bottomMargin0 data-role="toggle" aria-haspopup="true">&#43; Pick your Fav movie</Button>
              <DropdownMenu
                data-role="menu"
                aria-label="available flicks"
                onToggle={() => this.setState({ open: !this.state.open })}
              >
                {dropdownMenuChildren}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      }
    }

    const wrapper = shallow(<OpenProp />);
    expect(wrapper.props().children.props.open).to.eql(false);
    wrapper.children().find('Dropdown').simulate('toggle');
    expect(wrapper.props().children.props.open).to.eql(true);
  });

  it('renders custom menu', () => {
    const wrapper = mount(
      <Dropdown id="UniqueId" open={false} onToggle={onToggleAddMovie}>
        <Button align="end" bottomMargin0 data-role="toggle" aria-haspopup="true">&#43; Pick your Fav movie</Button>
        <CustomMenu data-role="menu">
          {dropdownMenuChildren}
        </CustomMenu>
      </Dropdown>);

    expect(wrapper.props().children[1].type).to.eql(CustomMenu);
  });

  it('should pass event, and source correctly when opened with keydown', () => {
    const wrapper = shallow(
      <Dropdown id="UniqueId" open={false} onToggle={onToggleAddMovie}>
        <Button align="end" bottomMargin0 data-role="toggle" aria-haspopup="true">&#43; Pick your Fav movie</Button>
        <DropdownMenu
          data-role="menu"
          aria-label="available flicks"
          onToggle={onToggleAddMovie}
        >
          {dropdownMenuChildren}
        </DropdownMenu>
      </Dropdown>);
    expect(Dropdown.prototype.handleKeyDown.calledOnce).to.equal(false);
    wrapper.children().find('Button').simulate('keydown', configKeyEvent(40));
    expect(Dropdown.prototype.handleKeyDown.calledOnce).to.equal(true);
  });

  it('should pass event, and source correctly when closed with tab', () => {
    const wrapper = shallow(
      <Dropdown id="UniqueId" open onToggle={onToggleAddMovie}>
        <Button align="end" bottomMargin0 data-role="toggle" aria-haspopup="true">&#43; Pick your Fav movie</Button>
        <DropdownMenu
          data-role="menu"
          aria-label="available flicks"
          onToggle={onToggleAddMovie}
        >
          {dropdownMenuChildren}
        </DropdownMenu>
      </Dropdown>);
    wrapper.children().find('Button').simulate('keydown', configKeyEvent(9));
    expect(Dropdown.prototype.handleKeyDown.calledTwice).to.equal(true);
  });
  it('should pass event, and source correctly when opened with enter', () => {
    const wrapper = shallow(
      <Dropdown id="UniqueId" open={false} onToggle={onToggleAddMovie}>
        <Button align="end" bottomMargin0 data-role="toggle" aria-haspopup="true">&#43; Pick your Fav movie</Button>
        <DropdownMenu
          data-role="menu"
          aria-label="available flicks"
          onToggle={onToggleAddMovie}
        >
          {dropdownMenuChildren}
        </DropdownMenu>
      </Dropdown>);
    wrapper.children().find('Button').simulate('keydown', configKeyEvent(13));
    expect(Dropdown.prototype.handleKeyDown.calledThrice).to.equal(true);
  });
});

describe('UncontrolledDropdown', () => {
  const onToggleAddMovie = spy();
  const onSelect = spy();

  const dropdownMenuChildren = [
    <ul key="0">
      <li><a>A New Hope</a></li>
      <li><a>Empire Strikes Back</a></li>
      <li><a>Return of Jedi</a></li>
      <li><a>The Phantom Menace</a></li>
      <li><a>Attack of Clones</a></li>
      <li><a>Revenge Of Sith</a></li>
    </ul>,
  ];
  it('should render dropdown using UncontrolledDropdown ', () => {
    const tether = {
      attachment: 'top right',
      classPrefix: 'flicks',
    };
    const wrapper = shallow(
      <UncontrolledDropdown tether={tether} id="UniqueId" onToggle={onToggleAddMovie}>
        <Button align="end" bottomMargin0 data-role="toggle" aria-haspopup="true">&#43; Pick your Fav movie</Button>
        <DropdownMenu
          data-role="menu"
          aria-label="available flicks"
        >
          {dropdownMenuChildren}
        </DropdownMenu>
      </UncontrolledDropdown>);
    expect(wrapper.type()).to.eql(Dropdown);
    expect(wrapper.props().id).to.eql('UniqueId');
    expect(Dropdown.prototype.handleToggle.called).to.equal(true);
  });

  it('should validate open status state change upon UncontrolledDropdown instance onToggle invoke ', () => {
    const wrapper = shallow(
      <UncontrolledDropdown id="UniqueId" onToggle={onToggleAddMovie}>
        <Button align="end" bottomMargin0 data-role="toggle" aria-haspopup="true">&#43; Pick your Fav movie</Button>
        <DropdownMenu
          data-role="menu"
          aria-label="available flicks"
        >
          {dropdownMenuChildren}
        </DropdownMenu>
      </UncontrolledDropdown>);
    expect(wrapper.instance().state.open).to.equal(false);
    wrapper.instance().handleToggle(() => {});
    expect(wrapper.instance().state.open).to.equal(true);
  });

  it('should validate onToggle callback is fired when open status state changes ', () => {
    const wrapper = shallow(
      <UncontrolledDropdown id="UniqueId" onSelectItem={onSelect} onToggle={onToggleAddMovie}>
        <Button align="end" bottomMargin0 data-role="toggle" aria-haspopup="true">&#43; Pick your Fav movie</Button>
        <DropdownMenu
          data-role="menu"
          aria-label="available flicks"
        >
          {dropdownMenuChildren}
        </DropdownMenu>
      </UncontrolledDropdown>);
    wrapper.instance().setState({ open: true });
    expect(wrapper.instance().props.onToggle.called).to.equal(true);
  });
});

