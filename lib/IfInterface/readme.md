# IfInterface

Yields the child elements only if the interface named in the `name` prop is present for the current session. If the `version` prop is also provided, then the interface is required to be available in a version that is compatible with the specified version: the same major version, and the same or higher minor version.

## Usage

```
<IfInterface name="loan-storage" version="1.0">
  <ViewUserLoans />
</IfInterface>
```

## Properties

Two properties are supported:

* `name` (mandatory): a short string containing the name of a FOLIO interface whose presence is required.
* `version` (optional): a two-faceted (_major_._minor_) interface version.

