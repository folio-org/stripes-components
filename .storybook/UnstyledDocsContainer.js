import React from 'react';
import { DocsContainer, Unstyled } from '@storybook/addon-docs/blocks';

export default function UnstyledDocsContainer({ children, context }) {
  return (
    <DocsContainer context={context}>
      <Unstyled>{children}</Unstyled>
    </DocsContainer>
  );
}
