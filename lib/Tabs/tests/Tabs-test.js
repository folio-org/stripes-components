import React from 'react';
import {
  describe,
  beforeEach,
  it,
} from 'mocha';

import {
  TabList as TabListInteractor,
  Tab as TabInteractor,
  TabPanel as TabPanelInteractor,
  including,
  Keyboard
} from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';

import Tabs from '../Tabs';
import TabList from '../TabList';
import Tab from '../Tab';
import TabPanel from '../TabPanel';

const doMount = () => {
  return mount(
    <Tabs>
      <TabList ariaLabel="My test aria label">
        <Tab>Tab 0</Tab>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
      </TabList>
      <TabPanel><>Panel 0</></TabPanel>
      <TabPanel><>Panel 1</></TabPanel>
      <TabPanel><>Panel 2</></TabPanel>
    </Tabs>
  );
};

describe('Tabs', () => {
  beforeEach(async () => {
    await doMount();
  });
  const tabList = TabListInteractor();
  const tab = TabInteractor('Tab 1');
  it('should render ul element', async () => {
    await tabList.exists();
  });
  it('ul element should have aria-label attribute containing passed prop', async () => {
    await tabList.has({ ariaLabel: 'My test aria label' });
  });
  it('renders correct number of tabs', async () => {
    await tabList.has({ tabsLength: 3 });
  });
  it('clicking a tab displays the appropriate tab panel', async () => {
    const tabPanel = TabPanelInteractor('Panel 1');
    await tab.click();
    await tabPanel.exists();
  });
  it('clicking a tab highlights it', async () => {
    await tab.click();
    await tab.has({ className: including('primary') });
  });
  it('clicking a tab gives it focus', async () => {
    await tab.click();
    await tab.has({ focused: true });
  });
  it('pressing right arrow when a tab has focus displays the next tab panel', async () => {
    const tabPanel2 = await TabPanelInteractor('Panel 2');
    await tab.click();
    await Keyboard.arrowRight();
    await tabPanel2.exists();
  });
  it('pressing left arrow when a tab has focus displays the previous tab panel', async () => {
    const tabPanel0 = await TabPanelInteractor('Panel 0');
    await tab.click();
    await Keyboard.arrowLeft();
    await tabPanel0.exists();
  });
  it('pressing left arrow when the first tab has focus displays does nothing', async () => {
    const tab0 = TabInteractor('Tab 0');
    const tabPanel0 = await TabPanelInteractor('Panel 0');
    await tab0.click();
    await Keyboard.arrowLeft();
    await tab0.has({ focused: true });
    await tabPanel0.exists();
  });
  it('pressing right arrow when the last tab has focus displays does nothing', async () => {
    const tab2 = TabInteractor('Tab 2');
    const tabPanel2 = await TabPanelInteractor('Panel 2');
    await tab2.click();
    await Keyboard.arrowRight();
    await tab2.has({ focused: true });
    await tabPanel2.exists();
  });
});
