import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import readme from '../readme.md';
import PopperDemo from './PopperDemo';

const withScroll = (component) => {
  return (
    <div
      style={{
        height: '500px',
        width: '500px',
        overflow: 'auto',
        background: '#eee',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          width: '230%',
          height: '230%',
          marginLeft: '-65%',
          marginTop: '-65%',
        }}
      >
        {component}
      </div>
    </div>
  );
};

export default {
  title: 'Popper',
  decorators: [withReadme(readme)],
};

export const BasicUsage = () => {
  return <PopperDemo />;
};

BasicUsage.story = {
  name: 'Basic usage',
};

export const ParentWithHiddenOverflow = () => {
  return (
    <div
      style={{
        height: '50px',
        overflow: 'hidden',
        background: '#eee',
      }}
    >
      <PopperDemo />
    </div>
  );
};

ParentWithHiddenOverflow.story = {
  name: 'Parent with hidden overflow',
};

export const ParentWithScrollOverflow = () => {
  return withScroll(<PopperDemo />);
};

ParentWithScrollOverflow.story = {
  name: 'Parent with scroll overflow',
};

export const RenderingOverlayInAPortal = () => {
  return (
    <div style={{ marginTop: '100px' }}>
      <PopperDemo portal={document.getElementById('OverlayContainer')} />
    </div>
  );
};

RenderingOverlayInAPortal.story = {
  name: 'Rendering overlay in a portal',
};
