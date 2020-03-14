import React, { Component } from 'react';
import Dropdown from '../Dropdown';
import Button from '../../Button/Button';
import DropdownMenu from '../../DropdownMenu/DropdownMenu';
import { Row, Col } from '../../LayoutGrid';
import MenuSection from '../../MenuSection';
import Checkbox from '../../Checkbox';
import Layout from '../../Layout';
import Select from '../../Select';

export default class layout extends Component {
  renderMenu = ({ onToggle }) => (
    <DropdownMenu
      id="ddMenu"
      aria-label="available permissions"
      onToggle={this.onToggle}
    >
      <MenuSection label="general">
        <ul>
          <li><Button buttonStyle="dropdownItem">First option does not close menu</Button></li>
          <li><Button buttonStyle="dropdownItem" onClick={onToggle}>Second option does!</Button></li>
        </ul>
      </MenuSection>
      <MenuSection label="setting">
        <Select label="Color">
          <option value="blue">ocean</option>
          <option value="green">grass</option>
          <option value="red">pomegranate</option>
        </Select>
      </MenuSection>
      <MenuSection label="columns">
        <Row>
          <Layout element={Col} className="padding-start-gutter padding-end-gutter" sm={12} md={6}>
            <Checkbox label="first" />
            <Checkbox label="second" />
            <Checkbox label="third" />
          </Layout>
          <Layout element={Col} className="padding-start-gutter padding-end-gutter" sm={12} md={6}>
            <Checkbox label="fourth" />
            <Checkbox label="fifth" />
            <Checkbox label="sixth" />
          </Layout>
        </Row>
      </MenuSection>
    </DropdownMenu>
  );

  render() {
    return (
      <>
        <Button>First action</Button>
        <Dropdown
          label="DropdownButton default"
          renderMenu={this.renderMenu}
        />
        <Button>Last action</Button>
        <Button>Last action</Button>
      </>
    );
  }
}
