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
