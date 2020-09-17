# ErrorBoundary
Catches JavaScript errors in child components and renders an error message instead of the actual content. 

The component will automatically render a more user-friendly error in production which hides technical information such as the error stack at first glance but enables the option to reveal it and copy it for debugging purposes.

The error stack will be visible in development to enable developers to immediately see the error stack.

## Basic Usage
```js
  import { ErrorBoundary } from '@folio/stripes/components';

  <ErrorBoundary>
    <MyComponent />
  </ErrorBoundary>
```

## Advanced Usage
In a lot of cases, the default reset action (a page refresh) will not solve the issue for the user since the error might be triggered when a specific route mounts. It can lead to frustration and confusion for the user if the proposed action does not resolve the problem or leaves them in a dead-end.

Instead, you can provide an alternative reset callback – such as e.g. redirecting to another page or the root of the app. This can be done by passing the `onReset`-callback. Remember to change the label of the primary/reset button accordingly to avoid confusing the user.

You can customize the error message even further by passing an alternative `title` and/or `subTitle`.

```js
  import { ErrorBoundary } from '@folio/stripes/components';

  <ErrorBoundary
    onReset={redirectToAnotherPage}
    resetButtonLabel="Go back"
    title="Whoops. Something happened."
    subTitle="Please try refreshing the page or navigating to the home page."
  >
    <MyComponent />
  </ErrorBoundary>
```

## Where to place error boundaries
The granularity of error boundaries is up to you. You may wrap top-level route components to display a “Something went wrong” message to the user. You may also wrap individual components in an error boundary to protect them from crashing the rest of the application.

**Note:** The FOLIO system wraps the app's root in an `ErrorBoundary` which will catch errors on a top-level.

## Props
Name | Type | Description | Options | Default
--- | --- | --- | --- | ---
children | node | Pass any component as a child to ErrorBoundary to enable error catching | |
layout | string | Force the error layout. This defaults to the current `process.env.NODE_ENV`. If the prop does not match one of the two options, it will default to the production layout. | `development` or `production` |
onReset | func | The callback that will be fired when clicking the primary button. This defaults to a page refresh.  | |
resetButtonLabel | node | The label for the primary/reset button | | `"Refresh page"`
subTitle | node | Renders the sub title of the error boundary in production | | `"Something went wrong"`
title | node | Renders the title of the error boundary in production | | `"Refresh the page to continue."`
