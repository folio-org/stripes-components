# Testing in Stripes Components

Tests can fortify new features from breaking changes, help prevent
bugs from being reintroduced, and overall future-proof our components
against an ever-changing ecosystem. As more people get involved and
contribute, they can be confident in fixing or introducing changes
without breaking existing functionality.

When we write tests, we need to make sure that they are resilient to
change as well as being easily understandable should somebody need to
add or adjust tests as other features are introduced and bugs are
fixed.

Stripes Components uses
[`@folio/stripes-cli`](https://github.com/folio-org/stripes-cli) to
launch a browser and run our tests using
[Karma](http://karma-runner.github.io). The tests themselves live
alongside each component in their own `tests` subdirectory, and are
written using [Mocha](https://mochajs.org/),
[Chai](https://github.com/chaijs/chai), and
[BigTest](https://bigtestjs.io/).

## When Should I Write Tests?

**Anytime you change or add features, you should be changing or adding
tests.**

If you are making a change to existing functionality, existing tests
should be updated. If there were no existing test to update, tests
should be added. If you are adding new features, you should write
plenty of tests for those new features so that you can rest assured
nobody else (or even yourself) accidentally breaks it in the future.

**Anytime you fix a bug, you should be adding new tests or adding to
existing tests.**

Bugs can obviously be a real pain. Even "simple" bugs can keep popping
up repeatedly as _seemingly unrelated_ things change in the code. When
you fix a bug, you most likely want it fixed for good. Writing tests
or fortifying existing tests makes it easily known if the bug is
accidentally introduced again when said tests fail.

**Write tests first!!!**

If you're writing a feature or fixing a bug, write or change some
tests first so that they fail expectedly, or the bug is successfully
reproduced. Then as you start adding or making changes, and your tests
start passing one-by-one, you know you're headed in the right
direction until they all pass when the feature is complete or the bug
is fixed.

## How Do I Write Tests?

Tests in stripes components are written using
[Mocha](https://mochajs.org/) via
[`@bigtest/mocha`](https://github.com/bigtestjs/mocha). This package
makes code within `it` blocks _convergent_, which means that if any
assertions within fail, they will run again repeatedly until they pass
or a timeout elapses. This makes testing asynchronous rendering easier
since we don't have to know exactly _when_ a component, or any updates
to a component, render into the DOM. As long as it renders within the
timeout, the test will eventually pass.

**Important:** since `it` blocks are convergent, and can be run
multiple or possibly hundreds of times, _side-effects should be kept
in hooks_ such as `beforeEach`. If an action, such as clicking an
element, is performed inside of a convergent `it`, the action could
happen repeatedly, further complicating any debugging or final error
thrown.

### Getting Started

A good place to start is by looking at existing tests. If the
component you're working on already has tests, you can add new tests
to existing setup hooks, or copy similar sections and change relevant
pieces. If the component does not have existing tests, check out
another component's tests, like [the `Button`
component](https://github.com/folio-org/stripes-components/blob/master/lib/Button/tests/Button-test.js),
and follow the same patterns but specific to the component you're
working on.

Here's a sample of tests from the `Button` component:

``` javascript
import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';

import Button from '../Button';
import ButtonInteractor from './interactor';

describe('Button', () => {
  const button = new ButtonInteractor();
  let clicked;

  beforeEach(async () => {
    clicked = false;

    await mount(
      <Button onClick={() => { clicked = true; }} id="button-test">
        test
      </Button>
    );
  });

  it('renders a <button> tag', () => {
    expect(button.isButton).to.be.true;
  });

  it('renders child text as its label', () => {
    expect(button.text).to.equal('test');
  });

  it('has an id on the root element', () => {
    expect(button.id).to.equal('button-test');
  });

  describe('clicking the button', () => {
    beforeEach(async () => {
      await button.click();
    });

    it('calls the onClick handler', () => {
      expect(clicked).to.be.true;
    });
  });
});
```

We use a helper called `mount` in our first `beforeEach` hook. This
helper will clean up and teardown any previously mounted component,
then mount our new component into the DOM for us. We use the
`async`/`await` syntax to wait for React to mount our component so the
tests don't start running too early. Since this helper cleans up
previous components on _the next_ call, this allows us to investigate
and debug our tests after they run. You can then use Mocha's `it.only`
to isolate a specific test to debug.

Since `@bigtest/mocha` makes our tests convergent, and could possibly
run them multiple times, _they only contain assertions_. You'll also
notice when we perform our `clicked` test that the `await
button.clickButton()` action is separated into it's own `beforeEach`
hook so it isn't accidentally invoked more than once. Separating
side-effects this way and repeatedly running our assertions until
completion results in _very fast testing times_. For example, the
tests above run and complete in _less than a tenth of a second_.

### Testing Component Interactions

In the previous example, all of our tests reference the `button = new
ButtonInteractor()` at the top of the test suite which is imported
from [the button's `tests/interactor.js`
file](https://github.com/folio-org/stripes-components/blob/master/lib/Button/tests/interactor.js).

``` javascript
import {
  interactor,
  is,
  attribute,
  hasClass
} from '@bigtest/interactor';

import css from '../Button.css';

export default interactor(class ButtonInteractor {
  static defaultScope = `.${css.button}`;
  id = attribute('id');
  href = attribute('href');
  isAnchor = is('a');
  isButton = is('button');
  rendersDefault = hasClass(css.default);
  rendersPrimary = hasClass(css.primary);
  rendersBottomMargin0 = hasClass(css.marginBottom0)
});
```

An `Interactor` is a composable [page
object](https://martinfowler.com/bliki/PageObject.html) we use
throughout our tests. This adds a layer of durability to our suite
because when things like classnames or the markup inevitably change,
we should only need to update our interactor as oppose to updating
each of our tests. Interactors can also be composed by each other, so
if another component uses a button, that component's interactor can
use the `ButtonInteractor` too.

Interactors are convergent and will wait for elements to exist in the
DOM before interacting with them. Interactor properties are also lazy
and do not query for the element until they are accessed. To learn
more about what they do, how to create your own interactors, and how
to then compose interactors, check out the [BigTest Interactor
Guides](https://bigtestjs.io/guides/interactors/introduction/).

#### Note about CSS classnames

When importing the `css` classnames, properties will return a
_space-separated_ list of names. To query for element via classname,
you must denote a class using a leading period (`.classname`). So
while ``.${css.button}`` works when a _single classname_ is returned,
it will not work when using postcss `compose:`, which returns
_multiple classnames_. For this, another helper is needed to convert
the classname string into a proper selector.

``` javascript
import { selectorFromClassnameString } from '../../../tests/helpers';

// neccessary due to composing classnames with postcss `composes`
const btnClass = selectorFromClassnameString(`.${css.button}`);
```

### "I need the `stripes`/`redux`/`intl` context"

**Components should be able to be tested in complete isolation.**

Components are meant to be reusable and composable. By having a
component rely on any context, they lose their reusability and make it
more difficult to compose them without the required context. A prime
example of this are the various `redux-form` reliant field
components. It was _impossible_ to use many of these components
outside of a `redux-form` connected HOC, [until
recently](https://issues.folio.org/browse/STCOM-269).

In fact, React is [deprecating the previously experimental context
API](https://reactjs.org/docs/legacy-context.html) in favor of a new
[props-based component API
instead](https://reactjs.org/docs/context.html). Once Stripes
Components and it's dependencies fully support the new context API,
you should only need to provide additional props instead of requiring
a top-level provider for context.

Until then, however, if you _absolutely need_ to provide your
component with the old context, there exists another testing mount
helper that will set up typical contexts found within a stripes
application.

``` javascript
// instead of importing `mount`, import `mountWithContext`
import { mountWithContext } from '../../../tests/helpers';

// ...

beforeEach(async () => {
  await mountWithContext(
    <Datepicker />
  );
});
```
