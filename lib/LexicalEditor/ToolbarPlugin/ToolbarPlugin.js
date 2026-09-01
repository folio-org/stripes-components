import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  $getTextContent,
  $isElementNode,
} from 'lexical';
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from '@lexical/list';
import {
  $isLinkNode,
  TOGGLE_LINK_COMMAND
} from '@lexical/link';
import { $isHeadingNode } from '@lexical/rich-text';

import { HeadingSelect } from './HeadingSelect';
import IconButton from '../../IconButton';
import { getSelectedNode } from '../utils';

import css from '../LexicalEditor.css';

const Divider = () => <div className={css.divider} />;

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [alignFormat, setAlignFormat] = useState({
    left: false,
    center: false,
    right: false,
    justify: false,
  });
  const [isLink, setIsLink] = useState(false);

  // this function reads the selected text and updates the toolbar to show which of the
  // formatting options are active for this selection
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    const node = getSelectedNode(selection);
    const parent = node.getParent();

    if ($isRangeSelection(selection)) {
      // update text format states
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));


      const alignmentStyle = $isElementNode(node)
        ? node.getFormatType()
        : parent?.getFormatType();

      setAlignFormat({
        left: false,
        center: false,
        right: false,
        justify: false,
        [alignmentStyle]: true,
      });

      // update heading type state
      const anchorNode = selection.anchor.getNode();
      const element =
      anchorNode.getKey() === 'root'
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow();
      const type = $isHeadingNode(element)
        ? element.getTag()
        : element.getType();
      setBlockType(type);

      // update link state
      if ($isLinkNode(parent) || $isLinkNode(anchorNode)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, []);

  const toggleLink = () => {
    editor.update(() => {
      if (!isLink) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, $getTextContent());
      } else {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      }
    });
  };

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(
          () => {
            updateToolbar();
          },
          { editor },
        );
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        payload => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        payload => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, updateToolbar]);

  return (
    <div className={css.toolbar} ref={toolbarRef}>
      <IconButton
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className={classNames(css.toolbarItem, css.spaced)}
        iconClassName={css.toolbarIcon}
        aria-label="Undo"
        icon="undo"
      />
      <IconButton
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className={css.toolbarItem}
        iconClassName={css.toolbarIcon}
        aria-label="Redo"
        icon="redo"
      />
      <Divider />
      <HeadingSelect blockType={blockType} />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={classNames(css.toolbarItem, css.spaced, { [css.active]: isBold })}
        iconClassName={css.toolbarIcon}
        aria-label="Format Bold"
        icon="bold"
      />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={classNames(css.toolbarItem, css.spaced, { [css.active]: isItalic })}
        iconClassName={css.toolbarIcon}
        aria-label="Format Italics"
        icon="italic"
      />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={classNames(css.toolbarItem, css.spaced, { [css.active]: isUnderline })}
        iconClassName={css.toolbarIcon}
        aria-label="Format Underline"
        icon="underline"
      />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={classNames(css.toolbarItem, css.spaced, { [css.active]: isStrikethrough })}
        iconClassName={css.toolbarIcon}
        aria-label="Format Strikethrough"
        icon="strikethrough"
      />
      <Divider />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className={classNames(css.toolbarItem, css.spaced, { [css.active]: alignFormat.left })}
        iconClassName={css.toolbarIcon}
        aria-label="Left Align"
        icon="text-align-start"
      />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className={classNames(css.toolbarItem, css.spaced, { [css.active]: alignFormat.center })}
        iconClassName={css.toolbarIcon}
        aria-label="Center Align"
        icon="text-align-center"
      />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className={classNames(css.toolbarItem, css.spaced, { [css.active]: alignFormat.right })}
        iconClassName={css.toolbarIcon}
        aria-label="Right Align"
        icon="text-align-end"
      />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        className={classNames(css.toolbarItem, css.spaced, { [css.active]: alignFormat.justify })}
        iconClassName={css.toolbarIcon}
        aria-label="Justify Align"
        icon="text-align-justify"
      />
      <Divider />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, 'ol');
        }}
        className={classNames(css.toolbarItem, css.spaced)}
        iconClassName={css.toolbarIcon}
        aria-label="Ordered list"
        icon="orderedlist"
      />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, 'ul');
        }}
        className={classNames(css.toolbarItem, css.spaced)}
        iconClassName={css.toolbarIcon}
        aria-label="Unordered list"
        icon="unorderedlist"
      />
      <IconButton
        onClick={toggleLink}
        className={classNames(css.toolbarItem, css.spaced, { [css.active]: isLink })}
        // iconClassName={css.toolbarIcon} // .toolbarIcon removes fill, but link icon uses fill to draw it's shape
        aria-label="Link"
        icon="link"
      />
    </div>
  );
};

export { ToolbarPlugin };
