import React, {
  useState,
} from 'react';
import PropTypes from 'prop-types';

import {
  IconButton,
} from '../..';

const propTypes = {

};

const TreeNode = (props) => {
  const {
    levelMapping,
    item,
    levelToggle,
    levelToggleAriaLabel,
  } = props;
  const [isOpen, setIsOpen] = useState(false);

  const showToggleButton = !!item.children;

  return (
    <li
      tabIndex="0" // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
      style={{ margin: '5px 0', verticalAlign: 'middle' }}
    >
      {showToggleButton && (
        <IconButton
          icon={isOpen ? 'caret-up' : 'caret-down'}
          onClick={() => {
            setIsOpen(!isOpen);
            levelToggle[item.type](!isOpen, item);
          }}
          ariaLabel={levelToggleAriaLabel[item.type]}
        />
      )}
      <span
        style={{ cursor: 'pointer', display: 'inline-block' }}
      >
        {levelMapping[item.type](item)}
      </span>
      <div style={{ paddingLeft: '2rem' }}>
        {isOpen && (
          <Tree
            {...props}
            treeData={item.children}
          />
        )}
      </div>
    </li>
  );
};

const Tree = (props) => {
  const {
    treeData,
  } = props;

  const renderItem = (item) => {
    return (
      <TreeNode
        {...props}
        item={item}
      />
    );
  };

  return (
    <ul style={{ listStyle: 'none', padding: '0' }}>
      {treeData.map(renderItem)}
    </ul>
  );
};

Tree.propTypes = propTypes;

export default Tree;
