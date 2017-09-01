import React from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import classNames from 'classnames';
import { DefaultAccordionHeader } from './headers';
import css from './Accordion.css';
import { HotKeys } from '../HotKeys';

const propTypes = {
  open: PropTypes.bool,
  id: PropTypes.string.isRequired,
  contentId: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired, // eslint-disable-line react/no-unused-prop-types
  displayWhenOpen: PropTypes.element, // eslint-disable-line react/no-unused-prop-types
  displayWhenClosed: PropTypes.element, // eslint-disable-line react/no-unused-prop-types
  onToggle: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  header: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.func]),
  contentRef: PropTypes.func,
  separator: PropTypes.bool,
  toggleKeyHandlers: PropTypes.object,
  toggleKeyMap: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

const defaultProps = {
  open: true,
  header: DefaultAccordionHeader,
  separator: true,
};

const Accordion = (props) => {
  let contentId;

  if (props.contentId) {
    contentId = props.contentId;
  } else {
    contentId = uniqueId('accordion');
  }

  const setContentRef = (ref) => {
    if (props.contentRef) {
      props.contentRef(ref);
    }
  };

  const getContentStyle = () => {
    const builtIn = [];
    if (!props.className) {
      if (/\s/.test(props.contentStyle)) {
        const csslist = props.buttonStyle.split(/\s+/);
        csslist.forEach((classname) => { builtIn.push(css[classname]); });
      } else {
        builtIn.push(css[props.contentStyle]);
      }
      return classNames(
        css.content,
        builtIn,
      );
    }
    return props.className;
  };

  const headerElement = React.createElement(props.header, { contentId, ...props });

  return (
    <section id={props.id} className={css.root} >
      <HotKeys keyMap={props.toggleKeyMap} handlers={props.toggleKeyHandlers} noWrapper >
        {headerElement}
      </HotKeys>
      <div className={css.content} ref={setContentRef} role="tabpanel" id={contentId}>
        {props.open &&
          props.children
        }
      </div>
      {props.separator && <div className={css.separator} />}
    </section>
  );
};

Accordion.propTypes = propTypes;
Accordion.defaultProps = defaultProps;

export default Accordion;
