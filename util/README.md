# `stripes-components` utility functions

This `util` area contains utility functions, whereas `../lib` contains utility components.

## this.transitionToParams(params)

Must be invoked with `this` bound to a React component that is beneath a React Router match, so that `this.props.location` and `this.context.router` are both defined.

Takes as its argument an object containing _key_: _value_ pairs. It transitions to a URL that is the same as the present one except that the specified query parameters are included -- replacing the same-named parameters if they already exist, and adding new parameters where they do not.

For example, if you are at the URL:
```
http://localhost:3000/users?filters=active.Active&sort=Name
```
and invoke this function as:
```
this.transitionToParams({ query: 'water', sort: 'Email' })
```
The application will transition to the new URL:
```
http://localhost:3000/users?filters=active.Active&sort=Water&query=Email
```
The `filters` query parameter is unaffected (since it was not included in the parameters passed in), the old `sort` value `Name` is replaced by the new value `Email`, and the new parameter `query` is added with the value `water`.

