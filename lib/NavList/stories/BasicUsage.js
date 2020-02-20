/**
 * List Component: Basic Usage
 */

import React from 'react';
import NavList from '../NavList';
import NavListSection from '../../NavListSection';
import NavListItem from '../../NavListItem';

export default () => (
  <div>
<div style={{display: 'flex'}}>
<NavList>
      <NavListSection label="General" activeLink="#staff-slips">
        <NavListItem>Circulation rules</NavListItem>
        <NavListItem>Circulation rules</NavListItem>
        <NavListItem>Circulation rules</NavListItem>
        <NavListItem>Circulation rules</NavListItem>
        <NavListItem>Circulation rules</NavListItem>
        <NavListItem>Other settings</NavListItem>
        <NavListItem href="#staff-slips">Staff slips</NavListItem>
      </NavListSection>

      <NavListSection label="Loans">
        <NavListItem>Fixed due date schedules</NavListItem>
        <NavListItem>Loan history</NavListItem>
        <NavListItem>Loan policies</NavListItem>
        <NavListItem>Loan policies</NavListItem>
      </NavListSection>
      <NavListSection label="Fee/fine">
        <NavListItem>Overdue fine policies</NavListItem>
        <NavListItem>Lost item fee policies</NavListItem>
      </NavListSection>
    </NavList>
<NavList>

      <NavListSection label="Loans">
        <NavListItem>Fixed due date schedules</NavListItem>
        <NavListItem>Loan history</NavListItem>
        <NavListItem>Loan policies</NavListItem>
      </NavListSection>
      <NavListSection label="Fee/fine">
        <NavListItem>Overdue fine policies</NavListItem>
        <NavListItem>Lost item fee policies</NavListItem>
      </NavListSection>
      <NavListSection label="Loans">
        <NavListItem>Fixed due date schedules</NavListItem>
        <NavListItem>Loan history</NavListItem>
      </NavListSection>
    </NavList>
</div>
  </div>
);
