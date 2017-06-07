# IfPermission

Yields the child elements only if the permission named in the `perm `prop is present in the object in the `currentPerms` prop (which is typically set to the complete permission set for the current user). The`'currentPermssions` prop must be passed in, which for Stripes modules can most easily be done as part of `{...this.props}`.

## Usage

```
<IfPermission perm="users.edit">
  <button onClick={this.onClickEditUser}>Edit</button>
</IfPermission>
```

## Properties

A single property is supported:

* `perm`: a short string containing the name of the permission that is required.
