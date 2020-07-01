/**
 * Link: Basic Usage
 */

import React from 'react';
import { HashRouter } from 'react-router-dom';
import Link from '../Link';

const BasicUsage = () => (
  <HashRouter>
    Lorem ipsum dolor sit amet, <Link to="/some-page">consectetur adipiscing elit</Link>. Mauris nec elementum quam. Aliquam porta sapien dolor, vel gravida risus condimentum et. Nam eget elit purus.
    <br /><br />
    <div style={{ width: 300 }}>
      <Link href="#some-hash">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec elementum quam. Aliquam porta sapien dolor, vel gravida risus condimentum et. Nam eget elit purus.</Link>
    </div>
  </HashRouter>
);

export default BasicUsage;
