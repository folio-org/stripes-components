# Testing Components

Component tests can be run by navigating to your `stripes-components` folder and running
```
yarn test
```
This will run the spin up karma via the `stripes-cli` an run the tests locally in the Chrome browser.

## Directory structure
Each component directory in lib should contain a `tests` directory that contains a test file named with the `<ComponentName>-test.js` format and an optional, but often quite useful `interactor.js` file. For example, the directory structure for `<Button>` looks like this:
```
Button
|-Button.js
|-Button.css
|-index.js
|-readme
|-tests
|  |-interactor.js
|  |-Button-test.js
```
## Interactors
An Interactor is a set quick values based on reading from and interaction with the rendered DOM. This employs [bigtest/interactor](https://github.com/bigtestjs/interactor) for setting up checks for event handlers, DOM attributes, classnames, etc.
See the [Button Interactor](lib/Button/tests/interactor.js) for an example.

## expect(tests).to.be.simple
Tests are mocha style, employing [bigtest/mocha](https://github.com/bigtestjs/mocha) to test for DOM updates asynchronously without having to worry about calling `wait(###)` to hope DOM updates have happened by the time your assertion is checked.
This requires a slighly different style to writing tests as outlined in bigtest/mocha's [documentation on writing tests](https://github.com/bigtestjs/mocha#writing-tests)
