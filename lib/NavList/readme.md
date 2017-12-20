# NavList

Renders a vertical navigation list in conjunction with NavListSection

## Basic Usage
NavList uses NavListSection to add one or more sections to your navigation. You can use React router's `<Link>` component to add links/buttons to your NavListSection or simply just buttons or anchor-tags.

```
  import NavList from '@folio/stripes-components/lib/NavList';
  import NavListSection from '@folio/stripes-components/lib/NavListSection';
  import Link from 'react-router-dom/Link';

  <NavList>
    <NavListSection label="Some label (optional)" activeLink="/active-link-here">
      <a>Users</a>
      <Link>Items</Link>
      <button>Check out</button>
      <a href="#organization">Organization</a>
      <button>Circulation</button>
      ...
    </NavListSection>
  </NavList>
```
