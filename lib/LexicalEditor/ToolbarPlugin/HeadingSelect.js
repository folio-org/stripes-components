import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import { $createHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';

import {
  Button,
  Dropdown,
  DropdownMenu,
} from '../../..';

const AVAILABLE_HEADINGS = ['h1', 'h2', 'h3'];

export const HeadingSelect = ({ blockType }) => {
  const [editor] = useLexicalComposerContext();

  const formatHeading = (_headingSize) => {
    if (blockType !== _headingSize) {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(_headingSize));
        }
      });
    }
  };

  const selectedHeading = AVAILABLE_HEADINGS.find(heading => heading === blockType) || AVAILABLE_HEADINGS[0];

  return (
    <Dropdown
      label={selectedHeading.toUpperCase()}
      buttonProps={{ buttonStyle: 'primary', marginBottom0: true }}
    >
      <DropdownMenu
        role="menu"
        aria-label="heading options"
      >
        <Button buttonStyle="dropdownItem" role="menuitem" onClick={() => formatHeading('h1')}>H1</Button>
        <Button buttonStyle="dropdownItem" role="menuitem" onClick={() => formatHeading('h2')}>H2</Button>
        <Button buttonStyle="dropdownItem" role="menuitem" onClick={() => formatHeading('h3')}>H3</Button>
      </DropdownMenu>
    </Dropdown>
  );
};

