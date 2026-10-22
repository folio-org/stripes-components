import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { TabsContext } from './TabsContext';

import css from './Tabs.css';

const TabPanel = (props) => {
  const {
    children,
    index
  } = props;

  const { selectedTabIndex } = useContext(TabsContext);

  return selectedTabIndex === index && (
    <div
      tabIndex={selectedTabIndex === index ? 0 : -1}
      id={`tabpanel-${index}`}
      className={css.tabPanel}
      role="tabpanel"
    >
      {children}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ]),
  index: PropTypes.number
};
export default TabPanel;
