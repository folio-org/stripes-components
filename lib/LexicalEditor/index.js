import { LexicalEditor } from './LexicalEditor';
import formField from '../FormField';
import parseMeta from '../FormField/parseMeta';

const LexicalEditorWithFieldProps = formField(
  LexicalEditor,
  ({ meta, input }) => ({
    onBlur: input.onBlur,
    dirty: meta.dirty,
    error: (meta.touched && meta.error ? meta.error : ''),
    valid: meta.valid,
    warning: (meta.touched ? parseMeta(meta, 'warning') : ''),
  })
);

export { LexicalEditorWithFieldProps as LexicalEditor };

