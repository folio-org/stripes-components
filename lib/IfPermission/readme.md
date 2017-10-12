# IfPermission

Yields the child elements only if the permission named in the `perm` prop is present for the  current user.

## Usage

```
<IfPermission perm="users.edit">
  <button onClick={this.onClickEditUser}>Edit</button>
</IfPermission>
```

## Properties

A single property is supported:

* `perm`: a short string containing the name of the permission that is required.

## Advanced Conditional Rendering

If your situation requires conditional rendering in case the user does not have the required permission, use the stripes' object's `hasPerm()` function directly instead of the `<IfPermission>` component in your JSX, like so:

```
<div>
  {
    this.props.stripes.hasPerm('user.examplePerm') ?
      <Button>You have permission!</Button> :
      <div>You don't have permission!</div>
  }
</div>
```
