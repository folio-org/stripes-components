/**
 * TextLink: Basic Usage
 */

import React from 'react';
import { HashRouter } from 'react-router-dom';
import Icon from '../../Icon';
import Tooltip from '../../Tooltip';
import TextLink from '../TextLink';

const BasicUsage = () => (
  <HashRouter>
    Lorem ipsum dolor sit amet,{' '}
    <TextLink to="/some-page">consectetur adipiscing elit</TextLink>. Mauris nec elementum quam.
    <TextLink target="_blank" rel="noopener noreferrer" href="https://folio.org">
      <Icon icon="external-link" iconPosition="end">
        This is an external link
      </Icon>
    </TextLink>
    <div style={{ width: 300 }}>
      <TextLink href="#some-hash">
        This is a multiline link. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec elementum quam.
        Aliquam porta sapien dolor, vel gravida risus condimentum et. Nam eget elit purus.
      </TextLink>
    </div>
    <Tooltip
      text="Go to link"
      id="link-tooltip"
    >
      {({ ref, ariaIds }) => (
        <TextLink
          to="/some-page"
          ref={ref}
          aria-labelledby={ariaIds.text}
        >
          With tooltip
        </TextLink>
      )}
    </Tooltip>
    <br></br>
    <TextLink>
      <span style={{display: "inline-flex"}}>It will be underlined</span>
    </TextLink>
  </HashRouter>
);

export default BasicUsage;
