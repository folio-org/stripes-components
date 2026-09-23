import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import { useEditorState } from '@tiptap/react';

import Select from '../../../Select';
import IconButton from '../../../IconButton';
import { LinkControl } from '../LinkControl/LinkControl';

import css from './Toolbar.css';

export const Toolbar = ({ editor, disabled = false, className }) => {
  const intl = useIntl();

  const editorState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => {
      if (!currentEditor) {
        return {
          bold: false,
          italic: false,
          underline: false,
          heading: 'p',
          align: 'left',
          link: false,
          isBulletList: false,
          isOrderedList: false,
        };
      }

      let heading = 'p';
      for (const level of [1, 2, 3]) {
        if (currentEditor.isActive('heading', { level })) {
          heading = String(level);
          break;
        }
      }

      let align = 'left';
      for (const value of ['left', 'center', 'right']) {
        if (currentEditor.isActive({ textAlign: value })) {
          align = value;
          break;
        }
      }

      return {
        bold: currentEditor.isActive('bold'),
        italic: currentEditor.isActive('italic'),
        underline: currentEditor.isActive('underline'),
        heading,
        align,
        isBulletList: currentEditor.isActive('bulletList') ?? false,
        isOrderedList: currentEditor.isActive('orderedList') ?? false,
        link: currentEditor.isActive('link'),
      };
    },
  });

  const headingOptions = [
    { value: 'p', label: intl.formatMessage({ id: 'stripes-components.editor.toolbar.heading.paragraph' }) },
    { value: '1', label: intl.formatMessage({ id: 'stripes-components.editor.toolbar.heading.heading1' }) },
    { value: '2', label: intl.formatMessage({ id: 'stripes-components.editor.toolbar.heading.heading2' }) },
    { value: '3', label: intl.formatMessage({ id: 'stripes-components.editor.toolbar.heading.heading3' }) },
  ];

  const handleHeadingChange = (e) => {
    const { value } = e.target;
    if (value === 'p') {
      editor?.chain().focus().setParagraph().run();
    } else {
      editor?.chain().focus().setHeading({ level: Number(value) }).run();
    }
  };

  return (
    <div className={classNames(css.toolbar, className)} role="toolbar">
      <div className={css.group}>
        <Select
          selectClass={css.headingSelect}
          aria-label={intl.formatMessage({ id: 'stripes-components.editor.toolbar.heading' })}
          value={editorState.heading}
          dataOptions={headingOptions}
          disabled={disabled}
          onChange={handleHeadingChange}
          marginBottom0
        />
      </div>

      <div className={css.group}>
        <IconButton
          icon="bold"
          className={classNames(css.toolbarButton, { [css.isActive]: editorState.bold })}
          label={intl.formatMessage({ id: 'stripes-components.editor.toolbar.bold' })}
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        />
        <IconButton
          icon="italic"
          className={classNames(css.toolbarButton, { [css.isActive]: editorState.italic })}
          label={intl.formatMessage({ id: 'stripes-components.editor.toolbar.italic' })}
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        />
        <IconButton
          icon="underline"
          className={classNames(css.toolbarButton, { [css.isActive]: editorState.underline })}
          label={intl.formatMessage({ id: 'stripes-components.editor.toolbar.underline' })}
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        />
      </div>

      <div className={css.group}>
        <IconButton
          icon="align-left"
          className={classNames(css.toolbarButton, { [css.isActive]: editorState.align === 'left' })}
          label={intl.formatMessage({ id: 'stripes-components.editor.toolbar.alignLeft' })}
          disabled={disabled}
          onClick={() => editor?.chain().focus().setTextAlign('left').run()}
        />
        <IconButton
          icon="align-center"
          className={classNames(css.toolbarButton, { [css.isActive]: editorState.align === 'center' })}
          label={intl.formatMessage({ id: 'stripes-components.editor.toolbar.alignCenter' })}
          disabled={disabled}
          onClick={() => editor?.chain().focus().setTextAlign('center').run()}
        />
        <IconButton
          icon="align-right"
          className={classNames(css.toolbarButton, { [css.isActive]: editorState.align === 'right' })}
          label={intl.formatMessage({ id: 'stripes-components.editor.toolbar.alignRight' })}
          disabled={disabled}
          onClick={() => editor?.chain().focus().setTextAlign('right').run()}
        />
      </div>

      <div className={css.group}>
        <IconButton
          icon="list"
          className={classNames(css.toolbarButton, { [css.isActive]: editorState.isBulletList })}
          label={intl.formatMessage({ id: 'stripes-components.editor.toolbar.bulletList' })}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <IconButton
          icon="ordered-list"
          className={classNames(css.toolbarButton, { [css.isActive]: editorState.isOrderedList })}
          label={intl.formatMessage({ id: 'stripes-components.editor.toolbar.orderedList' })}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
      </div>

      <div className={css.group}>
        <LinkControl editor={editor} disabled={disabled} />
      </div>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  editor: PropTypes.object,
};
