import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import Popover from '../../../Popover';
import Button from '../../../Button';
import TextField from '../../../TextField';
import IconButton from '../../../IconButton';

import css from './LinkControl.css';

export const LinkControl = ({ editor, disabled }) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');

  const isLinkActive = editor?.isActive('link') ?? false;

  const handleToggle = useCallback(() => {
    setOpen((wasOpen) => {
      const willOpen = !wasOpen;
      if (willOpen) {
        setUrl(editor?.getAttributes('link')?.href || '');
      }
      return willOpen;
    });
  }, [editor]);

  const applyLink = useCallback((e) => {
    e.preventDefault();
    if (url) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    } else {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    setOpen(false);
  }, [editor, url]);

  const removeLink = useCallback(() => {
    editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    setOpen(false);
  }, [editor]);

  return (
    <Popover
      open={open}
      onToggle={handleToggle}
      placement="bottom-start"
      autoFocusContent={false}
      renderTrigger={({ ref, toggle }) => (
        <IconButton
          ref={ref}
          icon="link"
          label={intl.formatMessage({ id: 'stripes-components.editor.toolbar.link' })}
          isActive={isLinkActive || open}
          disabled={disabled}
          onClick={toggle}
        />
      )}
    >
      <form className={css.linkPopoverContent} onSubmit={applyLink}>
        <TextField
          className={css.linkPopoverField}
          marginBottom0
          aria-label={intl.formatMessage({ id: 'stripes-components.editor.toolbar.link.url' })}
          placeholder="https://"
          value={url}
          autoFocus
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button type="submit" buttonStyle="primary" marginBottom0>
          {intl.formatMessage({ id: 'stripes-components.editor.toolbar.link.apply' })}
        </Button>
        {isLinkActive && (
          <Button type="button" marginBottom0 onClick={removeLink}>
            {intl.formatMessage({ id: 'stripes-components.editor.toolbar.link.remove' })}
          </Button>
        )}
      </form>
    </Popover>
  );
};

LinkControl.propTypes = {
  disabled: PropTypes.bool,
  editor: PropTypes.object,
};
