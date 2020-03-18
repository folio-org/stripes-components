# NavList

Renders a vertical navigation list in conjunction with NavListSection

## Basic Usage
NavList uses `<NavListSection>` to add one or more sections to your navigation.

You can use the `<NavListItem>` component to add links/buttons to your NavListSection. By using the "to"-prop it will render a react-router `<Link>`-component, using the "href"-prop will render a regular <a> and the "onClick"-prop will render a button. The component will accept any valid props that these HTML elements accepts.

```
  import { NavList, NavListItem, NavListSection } from '@folio/stripes/components';
  import Link from 'react-router-dom/Link';

  <NavList>
    <NavListSection label="Some label (optional)" activeLink="/active-link-here" striped>
      <NavListItem onClick={onClickHandler}>Users</NavListItem>
      <NavListItem href="#organization">Organization</NavListItem>
      <NavListItem to="circulation">Circulation</NavListItem>
    </NavListSection>
  </NavList>
```
