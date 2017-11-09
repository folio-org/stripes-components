import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';
import Icon from '../Icon';

import css from './LayoutHeader.css';

const propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  level: PropTypes.number, // eslint-disable-line
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      icon: PropTypes.string,
      handler: PropTypes.func,
    }),
  ),
  onDelete: PropTypes.func,
  noActions: PropTypes.bool,
};

const defaultProps = {
  level: 3,
};

const LayoutHeader = (props) => {
  const getHeader = () => React.createElement(`H${props.level}`, { style: { margin: 0 } }, props.title);


  const renderActions = () => {
    const renderedActions = [];
    if (props.noActions) {
      return [(<span key={`${props.title.toString()}-noAction`}>&nbsp;</span>)];
    }

    let actionList;
    if (!props.actions) {
      actionList = [
        { title: 'Delete',
          icon: 'trashBin',
          handler: props.onDelete,
        },
      ];
    } else {
      actionList = props.actions;
    }

    actionList.forEach((a, i) => {
      renderedActions.push(
        <Button
          key={`${a.name}-${i}`}
          buttonStyle="transparent slim"
          style={{ margin: 0, padding: 0 }}
          onClick={a.handler}
        >
          <Icon icon={a.icon} width="24px" height="24px" /> <span className="sr-only">{a.name}</span>
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
