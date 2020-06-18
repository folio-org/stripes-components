/**
 * Avatar
 */

import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import css from './Avatar.css';

const propTypes = {
  alt: PropTypes.string,
  ariaLabel: PropTypes.string,
  src: PropTypes.string,
};

const Avatar = ({ src, alt, ariaLabel, ...rest }) => {
  // Placeholder SVG
  let content = (
    // eslint-disable-next-line max-len
    <svg className={css.placeholder} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.2 19.4c-1.1.4-2.1.7-3.2 1.1-1.2.4-2.3.9-3.4 1.5-.2.1-.3.2-.5.3-.5.3-.7.8-.8 1.3v.3h23.2v-.4c0-.4-.2-.8-.5-1-.5-.4-1.1-.8-1.7-1.1-1.6-.8-3.2-1.3-4.9-1.9-.3-.1-.6-.2-.9-.4-.3-.2-.5-.4-.5-.8-.1-.5 0-1.1 0-1.6 0-.4.1-.8.4-1.1.6-.7.8-1.6 1-2.5.1-.4.2-.8.4-1.1.3-.6.5-1.3.5-1.9v-.5c-.3-.7-.1-1.2 0-1.9s.1-1.4-.2-2.1C16.3 4 14.9 3 12.9 2.7c-1.2-.2-2.4.1-2.7.2-1.9.6-3.1 1.8-3.5 3.7-.1.5 0 1 0 1.5 0 .3.1.6.1.8 0 .3 0 .6-.1.8-.1.2-.1.5-.1.7.1.7.3 1.3.6 1.9.2.4.2.8.3 1.2.2.8.4 1.7 1 2.3.4.4.5.7.5 1v1.5c0 .5-.2.9-.8 1.1z" /></svg>
  );

  // If we have a src attribute
  if (src) {
    content = (<img src={src} alt={alt} aria-label={rest['aria-label'] || ariaLabel} />);
  }

  return (
    <div {...rest} className={classnames(css.avatar, rest.className)} data-test-avatar>
      {content}
    </div>
  );
};

Avatar.propTypes = propTypes;

export default Avatar;
