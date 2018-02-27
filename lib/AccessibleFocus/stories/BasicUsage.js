/**
 * Accessible Focus: Basic Usage
 */

import React from 'react';
import AccessibleFocus from '../AccessibleFocus';
import Headline from '../../Headline';


const SimpleButton = props => <button style={{ position: 'relative', marginRight: '15px', padding: '30px 30px', minWidth: '220px', outline: 0, backgroundColor: '#f7f7f7' }} {...props}>{props.children}</button>; // eslint-disable-line react/prop-types

export default () => (
  <div style={{ padding: '15px' }}>
    <Headline>A simple focusable button</Headline>
    <AccessibleFocus component="button" style={{ padding: '5px 15px', border: '1px solid #cecece', borderRadius: '6px' }}>
      <span>Hello World</span>
    </AccessibleFocus>

    <br /><br /><br />

    <Headline>A simple button with a focusable inner element</Headline>
    <SimpleButton>
      <AccessibleFocus style={{ padding: '0px 5px' }}>
        <span>Hello World</span>
      </AccessibleFocus>
    </SimpleButton>

    <br /><br /><br />

    <Headline margin="small">Buttons with custom box offsets</Headline>
    <Headline size="small" margin="large" faded>Hover, focus or click to see the difference</Headline>

    <SimpleButton>
      <AccessibleFocus boxOffset="small">
        <span>Small Box Offset</span>
      </AccessibleFocus>
    </SimpleButton>

    <SimpleButton>
      <AccessibleFocus boxOffset="medium">
        <span>Medium Box Offset</span>
      </AccessibleFocus>
    </SimpleButton>

    <SimpleButton>
      <AccessibleFocus boxOffset="large">
        <span>Large Box Offset</span>
      </AccessibleFocus>
    </SimpleButton>

    <br /><br /><br />
    For different boxOffsets for each side you can use: <strong>boxOffsetStart, boxOffsetEnd, boxOffsetTop and boxOffsetBottom</strong>
    <br />
    <br />

    <SimpleButton>
      <AccessibleFocus boxOffsetStart="small">
        <span>Small Start Box Offset</span>
      </AccessibleFocus>
    </SimpleButton>

    <SimpleButton>
      <AccessibleFocus boxOffsetStart="medium">
        <span>Medium Start Box Offset</span>
      </AccessibleFocus>
    </SimpleButton>

    <SimpleButton>
      <AccessibleFocus boxOffsetStart="large">
        <span>Large Start Box Offset</span>
      </AccessibleFocus>
    </SimpleButton>

    <br /><br />

    <SimpleButton>
      <AccessibleFocus boxOffsetEnd="small">
        <span>Small End Box Offset</span>
      </AccessibleFocus>
    </SimpleButton>

    <SimpleButton>
      <AccessibleFocus boxOffsetEnd="medium">
        <span>Medium End Box Offset</span>
      </AccessibleFocus>
    </SimpleButton>

    <SimpleButton>
      <AccessibleFocus boxOffsetEnd="large">
        <span>Large End Box Offset</span>
      </AccessibleFocus>
    </SimpleButton>

    <br /><br />

    <SimpleButton>
      <AccessibleFocus boxOffsetTop="small">
        <span>Small Top Box Offset</span>
      </AccessibleFocus>
    </SimpleButton>

    <SimpleButton>
      <AccessibleFocus boxOffsetTop="medium">
        <span>Medium Top Box Offset</span>
      </AccessibleFocus>
    </SimpleButton>

    <SimpleButton>
      <AccessibleFocus boxOffsetTop="large">
        <span>Large Top Box Offset</span>
      </AccessibleFocus>
    </SimpleButton>

    <br /><br />

    <SimpleButton>
      <AccessibleFocus boxOffsetBottom="small">
        <span>Small Bottom Box Offset</span>
      </AccessibleFocus>
    </SimpleButton>

    <SimpleButton>
      <AccessibleFocus boxOffsetBottom="medium">
        <span>Medium Bottom Box Offset</span>
      </AccessibleFocus>
    </SimpleButton>

    <SimpleButton>
      <AccessibleFocus boxOffsetBottom="large">
        <span>Large Bottom Box Offset</span>
      </AccessibleFocus>
    </SimpleButton>

    <br /><br /><br />

    <Headline margin="small">Buttons with focus dot</Headline>
    <Headline size="small" margin="large" faded>Tab through the buttons below to see the focus dot in action</Headline>
    <AccessibleFocus component={SimpleButton} focusDot>Focus dot with focusDotPosition: <strong>start</strong> (default)</AccessibleFocus>
    <AccessibleFocus component={SimpleButton} focusDot focusDotPosition="end">Focus dot with focusDotPosition: <strong>end</strong></AccessibleFocus>
    <AccessibleFocus component={SimpleButton} focusDot focusDotPosition="top">Focus dot with focusDotPosition: <strong>top</strong></AccessibleFocus>
    <AccessibleFocus component={SimpleButton} focusDot focusDotPosition="bottom">Focus dot with focusDotPosition: <strong>bottom</strong></AccessibleFocus>

    <br /><br />
    You can also specify different offsets for focus dots by setting the <strong>focusDotOffset</strong> prop to <strong>small, medium or large</strong>
    <br />
    <br />
    <AccessibleFocus component={SimpleButton} focusDot focusDotOffset="small">focusDotPosition: <strong>start</strong> and focusDotOffset: <strong>small</strong></AccessibleFocus>
    <AccessibleFocus component={SimpleButton} focusDot focusDotOffset="small" focusDotPosition="end">focusDotPosition: <strong>end</strong> and focusDotOffset: <strong>small</strong></AccessibleFocus>
    <AccessibleFocus component={SimpleButton} focusDot focusDotOffset="small" focusDotPosition="top">focusDotPosition: <strong>top</strong> and focusDotOffset: <strong>small</strong></AccessibleFocus>
    <AccessibleFocus component={SimpleButton} focusDot focusDotOffset="small" focusDotPosition="bottom">focusDotPosition: <strong>bottom</strong> and focusDotOffset: <strong>small</strong></AccessibleFocus>
    <br />
    <br />
    <AccessibleFocus component={SimpleButton} focusDot focusDotOffset="medium">focusDotPosition: <strong>start</strong> and focusDotOffset: <strong>medium</strong></AccessibleFocus>
    <AccessibleFocus component={SimpleButton} focusDot focusDotOffset="medium" focusDotPosition="end">focusDotPosition: <strong>end</strong> and focusDotOffset: <strong>medium</strong></AccessibleFocus>
    <AccessibleFocus component={SimpleButton} focusDot focusDotOffset="medium" focusDotPosition="top">focusDotPosition: <strong>top</strong> and focusDotOffset: <strong>medium</strong></AccessibleFocus>
    <AccessibleFocus component={SimpleButton} focusDot focusDotOffset="medium" focusDotPosition="bottom">focusDotPosition: <strong>bottom</strong> and focusDotOffset: <strong>medium</strong></AccessibleFocus>
    <br />
    <br />
    <AccessibleFocus component={SimpleButton} focusDot focusDotOffset="large">focusDotPosition: <strong>start</strong> and focusDotOffset: <strong>large</strong></AccessibleFocus>
    <AccessibleFocus component={SimpleButton} focusDot focusDotOffset="large" focusDotPosition="end">focusDotPosition: <strong>end</strong> and focusDotOffset: <strong>large</strong></AccessibleFocus>
    <AccessibleFocus component={SimpleButton} focusDot focusDotOffset="large" focusDotPosition="top">focusDotPosition: <strong>top</strong> and focusDotOffset: <strong>large</strong></AccessibleFocus>
    <AccessibleFocus component={SimpleButton} focusDot focusDotOffset="large" focusDotPosition="bottom">focusDotPosition: <strong>bottom</strong> and focusDotOffset: <strong>large</strong></AccessibleFocus>
  </div>
);
