  import React from 'react';
  import Dropdown from '../../lib/Dropdown/index';
  import Button from '../../lib/Button/index';
  import DropdownMenu from '../../lib/DropdownMenu/index';


  describe('Dropdown', () => {
    const permissionsDD = shallow(
      <ul>
        <li><a>A New Hope</a></li>
        <li><a>Empire Strikes Back</a></li>
        <li><a>Return of Jedi</a></li>
        <li><a>The Phantom Menace</a></li>
        <li><a>Attack of Clones</a></li>
        <li><a>Revenge Of Sith</a></li>
      </ul>,
      );
    const onToggleAddPermDD = spy();
    it('should be a list item', () => {
      const wrapper = shallow(
        <Dropdown id="AddPermissionDropdown" open={false} onToggle={onToggleAddPermDD}>
          <Button align="end" bottomMargin0 data-role="toggle" aria-haspopup="true">&#43; Add Permission</Button>
          <DropdownMenu
            data-role="menu"
            aria-label="available permissions"
            onToggle={onToggleAddPermDD}
          > {permissionsDD}</DropdownMenu>
        </Dropdown>);
      expect(wrapper.type()).to.eql('div');
      expect(wrapper.props().id).to.eql('AddPermissionDropdown');
      expect(wrapper.props().children.props.renderElementTo).to.eql(null);
    });

    it('should change attachment postion with ', () => {
      const tether = {
        attachment: 'top right',
        classPrefix: 'permissions',
      };
      const wrapper = shallow(
        <Dropdown tether={tether} id="AddPermissionDropdown" open={false} onToggle={onToggleAddPermDD}>
          <Button align="end" bottomMargin0 data-role="toggle" aria-haspopup="true">&#43; Add Permission</Button>
          <DropdownMenu
            data-role="menu"
            aria-label="available permissions"
            onToggle={onToggleAddPermDD}
          > {permissionsDD}</DropdownMenu>
        </Dropdown>);
      expect(wrapper.type()).to.eql('div');
      expect(wrapper.props().id).to.eql('AddPermissionDropdown');
      expect(wrapper.props().children.props.renderElementTo).to.eql(null);
      expect(wrapper.props().children.props.attachment).to.eql('top right');
    });

    it('should toggle open/closed', () => {
      const tether = {
        attachment: 'top right',
        classPrefix: 'permissions',
      };
      spy(Dropdown.prototype, 'handleToggle');
      const wrapper = shallow(
        <Dropdown tether={tether} id="AddPermissionDropdown" open={false} onToggle={onToggleAddPermDD}>
          <Button align="end" bottomMargin0 data-role="toggle" aria-haspopup="true">&#43; Add Permission</Button>
          <DropdownMenu
            data-role="menu"
            aria-label="available permissions"
            onToggle={onToggleAddPermDD}
          > {permissionsDD}</DropdownMenu>
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
                <Button align="end" bottomMargin0 data-role="toggle" aria-haspopup="true">&#43; Add Permission</Button>
                <DropdownMenu
                  data-role="menu"
                  aria-label="available permissions"
                  onToggle={() => this.setState({ open: !this.state.open })}
                > {permissionsDD}</DropdownMenu>
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
  });
