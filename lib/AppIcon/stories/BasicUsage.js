/**
 * AppIcon: Basic Usage
 */

import React from 'react';
import Headline from '../../Headline';
import AppIcon from '../AppIcon';

export default () => (
  <div style={{ padding: '15px' }}>
<<<<<<< HEAD
    <Headline>Default Icon</Headline>
    <AppIcon size="small" /> (placeholder)
    <br /><br />
    <AppIcon size="small">
      <img src="http://174.138.40.142/wp-content/prototypes/233/4/en/app_icon_large.png" alt="" />
    </AppIcon>
    <br /><br />
    <AppIcon size="medium">
      <img src="http://174.138.40.142/wp-content/prototypes/233/4/en/app_icon_large.png" alt="" />
    </AppIcon>
    <br /><br />
    <AppIcon size="large">
      <img src="http://174.138.40.142/wp-content/prototypes/233/4/en/app_icon_large.png" alt="" />
    </AppIcon>
=======
    <Headline>Block Icon</Headline>
    <AppIcon iconSize="small">
      <img src="http://174.138.40.142/wp-content/prototypes/233/4/en/app_icon_large.png" alt="" />
    </AppIcon>
    <br /><br />
    <AppIcon iconSize="medium">
      <img src="http://174.138.40.142/wp-content/prototypes/233/4/en/app_icon_large.png" alt="" />
    </AppIcon>
    <br /><br />
    <AppIcon iconSize="large">
      <img src="http://174.138.40.142/wp-content/prototypes/233/4/en/app_icon_large.png" alt="" />
    </AppIcon>
    <br />
    <br />
    <hr />
    <br />
    <Headline>Outline Icon</Headline>
    <AppIcon iconSize="small" iconStyle="outline">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.8 23.3c-1.8 0-3.3-1.1-3.7-2.7-3.2-.3-6.6-1.1-6.6-3 0-.9.8-2.2 2.3-2.9C3.9 9.8 6 5.7 9.1 4v-.5C9.1 1.9 10.4.6 12 .6s2.9 1.3 2.9 2.9v.6c3.1 1.7 5.2 5.8 5.3 10.6 1.4.7 2.3 2.1 2.3 2.9 0 2-3.7 2.8-7.1 3.1-.4 1.5-1.9 2.6-3.6 2.6zM10 19.9c0 .8.8 1.4 1.8 1.4s1.7-.6 1.8-1.4v-.1c0-.3.1-.5.2-.7.2-.2.4-.3.7-.3 3.6-.2 5.5-.9 6-1.2-.2-.3-.7-1-1.5-1.2-.5-.1-.8-.6-.7-1.1 0-4.5-2-8.5-4.7-9.6-.4-.2-.6-.5-.6-.9V3.6c0-.5-.4-.9-.9-.9s-.9.4-.9.9v1.1c0 .4-.2.8-.6.9-2.9 1.1-4.8 5.1-4.9 9.6.1.5-.2.9-.7 1.1-.8.2-1.3.8-1.5 1.2.5.3 2.2 1 5.5 1.2.5 0 .9.5.9 1 .1.1.1.1.1.2z" /></svg>
    </AppIcon>
    <br /><br />
    <AppIcon iconSize="medium" iconStyle="outline">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.8 23.3c-1.8 0-3.3-1.1-3.7-2.7-3.2-.3-6.6-1.1-6.6-3 0-.9.8-2.2 2.3-2.9C3.9 9.8 6 5.7 9.1 4v-.5C9.1 1.9 10.4.6 12 .6s2.9 1.3 2.9 2.9v.6c3.1 1.7 5.2 5.8 5.3 10.6 1.4.7 2.3 2.1 2.3 2.9 0 2-3.7 2.8-7.1 3.1-.4 1.5-1.9 2.6-3.6 2.6zM10 19.9c0 .8.8 1.4 1.8 1.4s1.7-.6 1.8-1.4v-.1c0-.3.1-.5.2-.7.2-.2.4-.3.7-.3 3.6-.2 5.5-.9 6-1.2-.2-.3-.7-1-1.5-1.2-.5-.1-.8-.6-.7-1.1 0-4.5-2-8.5-4.7-9.6-.4-.2-.6-.5-.6-.9V3.6c0-.5-.4-.9-.9-.9s-.9.4-.9.9v1.1c0 .4-.2.8-.6.9-2.9 1.1-4.8 5.1-4.9 9.6.1.5-.2.9-.7 1.1-.8.2-1.3.8-1.5 1.2.5.3 2.2 1 5.5 1.2.5 0 .9.5.9 1 .1.1.1.1.1.2z" /></svg>
    </AppIcon>
    <br /><br />
    <AppIcon iconSize="large" iconStyle="outline" active>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.8 23.3c-1.8 0-3.3-1.1-3.7-2.7-3.2-.3-6.6-1.1-6.6-3 0-.9.8-2.2 2.3-2.9C3.9 9.8 6 5.7 9.1 4v-.5C9.1 1.9 10.4.6 12 .6s2.9 1.3 2.9 2.9v.6c3.1 1.7 5.2 5.8 5.3 10.6 1.4.7 2.3 2.1 2.3 2.9 0 2-3.7 2.8-7.1 3.1-.4 1.5-1.9 2.6-3.6 2.6zM10 19.9c0 .8.8 1.4 1.8 1.4s1.7-.6 1.8-1.4v-.1c0-.3.1-.5.2-.7.2-.2.4-.3.7-.3 3.6-.2 5.5-.9 6-1.2-.2-.3-.7-1-1.5-1.2-.5-.1-.8-.6-.7-1.1 0-4.5-2-8.5-4.7-9.6-.4-.2-.6-.5-.6-.9V3.6c0-.5-.4-.9-.9-.9s-.9.4-.9.9v1.1c0 .4-.2.8-.6.9-2.9 1.1-4.8 5.1-4.9 9.6.1.5-.2.9-.7 1.1-.8.2-1.3.8-1.5 1.2.5.3 2.2 1 5.5 1.2.5 0 .9.5.9 1 .1.1.1.1.1.2z" /></svg>
    </AppIcon>
    <br />
    <br />
    <hr />
    <br />
    <Headline margin="small">With focus/active styles</Headline>
    <Headline faded size="small" margin="large">(icon placed inside button- or anchor-tag)</Headline>
    <button style={{ outline: 0 }}>
      <AppIcon iconSize="medium">
        <img src="http://174.138.40.142/wp-content/prototypes/233/4/en/app_icon_large.png" alt="" />
      </AppIcon>
    </button>
    <br />
    <br />
    <button style={{ outline: 0 }}>
      <AppIcon iconSize="medium" iconStyle="outline" active>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.8 23.3c-1.8 0-3.3-1.1-3.7-2.7-3.2-.3-6.6-1.1-6.6-3 0-.9.8-2.2 2.3-2.9C3.9 9.8 6 5.7 9.1 4v-.5C9.1 1.9 10.4.6 12 .6s2.9 1.3 2.9 2.9v.6c3.1 1.7 5.2 5.8 5.3 10.6 1.4.7 2.3 2.1 2.3 2.9 0 2-3.7 2.8-7.1 3.1-.4 1.5-1.9 2.6-3.6 2.6zM10 19.9c0 .8.8 1.4 1.8 1.4s1.7-.6 1.8-1.4v-.1c0-.3.1-.5.2-.7.2-.2.4-.3.7-.3 3.6-.2 5.5-.9 6-1.2-.2-.3-.7-1-1.5-1.2-.5-.1-.8-.6-.7-1.1 0-4.5-2-8.5-4.7-9.6-.4-.2-.6-.5-.6-.9V3.6c0-.5-.4-.9-.9-.9s-.9.4-.9.9v1.1c0 .4-.2.8-.6.9-2.9 1.1-4.8 5.1-4.9 9.6.1.5-.2.9-.7 1.1-.8.2-1.3.8-1.5 1.2.5.3 2.2 1 5.5 1.2.5 0 .9.5.9 1 .1.1.1.1.1.2z" /></svg>
      </AppIcon>
    </button>
>>>>>>> e1de063... Added focusable prop which controls if an app icon can be focused when inside a button or anchor-tag
  </div>
);
