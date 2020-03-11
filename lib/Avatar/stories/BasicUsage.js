/**
 * Avatar: Basic Usage
 */

import React from 'react';
import Avatar from '../Avatar';
import Headline from '../../Headline';
import dummyImage from './dummy-profile-picture.jpg';

export default () => (
  <div>
    <Headline margin="none">No image</Headline>
    <Headline faded size="small">Falls back to placeholder</Headline>
    <br />
    <Avatar />
    <br />
    <br />
    <Headline margin="none">With image:</Headline>
    <br />
    <Avatar src={dummyImage} aria-label="John Username" />
  </div>
);
