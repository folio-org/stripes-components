# Callout
Keep your user informed about the actions they take! Callout creates a small alert that appears at the bottom of the workspace.

**NOTE.**
You probably want to use [`<CalloutContext>`](https://github.com/folio-org/stripes-core/blob/master/doc/callouts.md) rather than this.

## Usage
Simply add the `<Callout>` component to your module with a ref. This works best at the highest level of your module.
```
// In your constructor
this.callout = React.createRef();

// In your JSX
<Callout ref={this.callout}/>
```
Use the ref to the `<Callout>` to call the `sendCallout` method, supplying a configuration object for the callout:
```
  announce(){
    this.callout.current.sendCallout({
      type: 'success',
      message: (<span><strong>Hey!!</strong> This is a <strong>callout!</strong></span> )
    })
  }
```

## Callout Configuration
prop | description | default | required
-- | -- | -- | --
type | 'success', 'error', 'warning', 'info'. | 'success' |
timeout | timeout for automatic dismissal, in milliseconds. Can be set to 0 to only allow for user-dismissal. | 6000 |
message | String or HTML to render in the content of the callout. | | &#10004;
dedupe | When true, prevents displaying duplicate callouts with the same message and type. | true |
