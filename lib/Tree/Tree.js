import React, {
  useState,
} from 'react';
import PropTypes from 'prop-types';

import {
  IconButton,
} from '../..';

const propTypes = {

};

const Tree = ({
  children,
  content,
  open,
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState(open);

  const renderContent = () => {
    if (typeof content === 'function') {
      return content();
    }

    return content;
  };

  const showToggleButton = !!children;

  return (
    <div>
      {showToggleButton && (
        <IconButton
          icon={isOpen ? 'caret-up' : 'caret-down'}
          onClick={() => setIsOpen(!isOpen)}
        />
      )}
      <span onClick={onClick} style={{ cursor: 'pointer' }}>{renderContent()}</span>
      <div style={{ paddingLeft: '2rem' }}>
        {isOpen && children}
      </div>
    </div>
  );
};

Tree.propTypes = propTypes;

export default Tree;
