# ConflictDetectionBanner
Display a message to the user when a conflict due to optimistic locking occurs.

## Basic Usage
```js
import { ConflictDetectionBanner } from '@folio/stripes/components';

// in component's body

const conflictDetectionBannerRef = useRef(null);

// handler for focusing the banner
const focusConflictDetectionBanner = () => {
  conflictDetectionBannerRef.current.focus();
};

// ...in JSX...
<ConflictDetectionBanner
  latestVersionLink="path/to/the/view/record/page"
  conflictDetectionBannerRef={conflictDetectionBannerRef}
  focusConflictDetectionBanner={focusConflictDetectionBanner}
/>
```

## Properties

Name | Type | Description | Required
--- | --- | --- | ---
latestVersionLink | string | Path to the View page of the record being edited | &#10004;
conflictDetectionBannerRef | `ref` | Reference to DOM element that should be focused when focusConflictDetectionBanner is called | &#10004;
focusConflictDetectionBanner | func | Used to focus the component | &#10004; 
