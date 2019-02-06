import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import readme from '../readme.md';
import PopperDemo from './PopperDemo';

const withScroll = (component) => {
  return (
    <div style={
      {
        height: '500px',
        width: '500px',
        overflow: 'auto',
        background: '#eee',
        textAlign: 'center',
      }
    }
    >
      <div style={{
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

storiesOf('Popper', module)
  .addDecorator(withReadme(readme))
  .add('Basic usage', () => {
    return (
      <PopperDemo />
    );
  })
  .add('Parent with hidden overflow', () => {
    return (
      <div style={
        {
          height: '50px',
          overflow: 'hidden',
          background: '#eee',
        }
      }
      >
        <PopperDemo />
      </div>
    );
  })
  .add('Parent with scroll overflow', () => {
    return withScroll(<PopperDemo />);
  })
  .add('Rendering overlay in a portal', () => {
    return (
      <div style={{ marginTop: '100px' }}>
        <PopperDemo portal={document.getElementById('OverlayContainer')} />
      </div>
    );
  });
