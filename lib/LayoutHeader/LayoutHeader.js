import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';
import Icon from '../Icon';

import css from './LayoutHeader.css';

const propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      handler: PropTypes.func,
      icon: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
  level: PropTypes.number,
  noActions: PropTypes.bool,
  onDelete: PropTypes.func,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
};

const defaultProps = {
  level: 3,
};

const LayoutHeader = ({ title, level, actions, onDelete, noActions }) => {
  const getHeader = () => React.createElement(`h${level}`, { style: { margin: 0 } }, title);


  const renderActions = () => {
    const renderedActions = [];
    if (noActions) {
      return [(<span key={`${title.toString()}-noAction`}>&nbsp;</span>)];
    }

    let actionList;
    if (!actions) {
      actionList = [
        { title: 'Delete',
          icon: 'trash',
          handler: onDelete },
      ];
    } else {
      actionList = actions;
    }

    actionList.forEach((a, i) => {
      renderedActions.push(
        <Button
          key={`${a.name}-${i}`}
          buttonStyle="link slim"
          style={{ margin: 0, padding: 0 }}
          onClick={a.handler}
        >
          <Icon icon={a.icon} width="24px" height="24px" />
          {' '}
          <span className="sr-only">{a.name}</span>
        </Button>,
      );
    });
    return renderedActions;
  };

  return (
    <div className={css.sectionHeader}>
      <div>
        {getHeader()}
      </div>
      <div className={css.sectionActions}>
        {renderActions()}
      </div>
    </div>
  );
};

LayoutHeader.propTypes = propTypes;
LayoutHeader.defaultProps = defaultProps;

export default LayoutHeader;
