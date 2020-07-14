/**
 * Link: Basic Usage
 */

import React from 'react';
import { HashRouter } from 'react-router-dom';
import Icon from '../../Icon';
import Tooltip from '../../Tooltip';
import Link from '../Link';

const BasicUsage = () => (
  <HashRouter>
    Lorem ipsum dolor sit amet, <Link to="#/some-page">consectetur adipiscing elit</Link>. Mauris nec elementum quam.
    <br /><br />
    <Link target="_blank" rel="noopener noreferrer" href="https://folio.org">
      <Icon icon="external-link" iconPosition="end">
          This is an external link
      </Icon>
    </Link>
    <br /><br />
    <div style={{ width: 300 }}>
      <Link href="#some-hash">
        This is a multiline link. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec elementum quam.
        Aliquam porta sapien dolor, vel gravida risus condimentum et. Nam eget elit purus.
      </Link>
    </div>
    <br /><br />
    <Tooltip
      text="Go to link"
      id="link-tooltip"
    >
      {({ ref, ariaIds }) => (
        <Link
          to="/some-page"
          ref={ref}
          aria-labelledby={ariaIds.text}
        >
          With tooltip
        </Link>
      )}
    </Tooltip>
  </HashRouter>
);

export default BasicUsage;
