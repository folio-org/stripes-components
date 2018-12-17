# ErrorBoundary
Catches JavaScript errors in child components and renders an error message instead of the actual content.

## Basic Usage
```js
  import { ErrorBoundary } from '@folio/stripes/components';

  <ErrorBoundary>
    <MyComponent />
  </ErrorBoundary>
```

## Where to place error boundaries
The granularity of error boundaries is up to you. You may wrap top-level route components to display a “Something went wrong” message to the user. You may also wrap individual components in an error boundary to protect them from crashing the rest of the application.

**Note:** The FOLIO system wraps the app's root in an `ErrorBoundary` which will catch errors on a top-level.

## Props
Name | type | description
--- | --- | ---
children | node | Pass any component as a child to ErrorBoundary to enable error catching