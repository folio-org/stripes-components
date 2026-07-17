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
} from 'lexical';
import { INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';

import IconButton from '../../IconButton';

import css from '../LexicalEditor.css';

const Divider = () => <div className={css.divider} />;

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(
          () => {
            $updateToolbar();
          },
          { editor },
        );
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
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
  }, [editor, $updateToolbar]);

  return (
    <div className={css.toolbar} ref={toolbarRef}>
      <IconButton
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className={classNames(css.toolbarItem, css.spaced)}
        aria-label="Undo"
        icon="undo"
      />
      <IconButton
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className={css.toolbarItem}
        aria-label="Redo"
        icon="redo"
      />
      <Divider />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={classNames(css.toolbarItem, css.spaced, { [css.active]: isBold })}
        aria-label="Format Bold"
        icon="bold"
      />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={classNames(css.toolbarItem, css.spaced, { [css.active]: isItalic })}
        aria-label="Format Italics"
        icon="italic"
      />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={classNames(css.toolbarItem, css.spaced, { [css.active]: isUnderline })}
        aria-label="Format Underline"
        icon="underline"
      />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={classNames(css.toolbarItem, css.spaced, { [css.active]: isStrikethrough })}
        aria-label="Format Strikethrough"
        icon="strikethrough"
      />
      <Divider />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className={classNames(css.toolbarItem, css.spaced)}
        aria-label="Left Align"
        icon="text-align-start"
      />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className={classNames(css.toolbarItem, css.spaced)}
        aria-label="Center Align"
        icon="text-align-center"
      />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className={classNames(css.toolbarItem, css.spaced)}
        aria-label="Right Align"
        icon="text-align-end"
      />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        className={css.toolbarItem}
        aria-label="Justify Align"
        icon="text-align-justify"
      />
      <Divider />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, 'ul');
        }}
        className={css.toolbarItem}
        aria-label="Unordered list"
        icon="list"
      />
    </div>
  );
};

export { ToolbarPlugin };
