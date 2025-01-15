import { Parser } from 'json2csv';
import { OVERLAY_CONTAINER_ID } from '../util/consts';

// Ignoring next block in tests since we don't have a great way to suppress downloads in tests
// istanbul ignore next
function triggerDownload(csv, fileTitle) {
  const exportedFilename = fileTitle ? fileTitle + '.csv' : 'export.csv';
  const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, exportedFilename);
  } else {
    const link = document.createElement('a');
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('data-test-exportcsv-link', 'true');
      link.setAttribute('download', exportedFilename);
      link.style.visibility = 'hidden';

      // A download link is created within OverlayContainer element, falling back to the body.
      // A click() on this element outside of the OverlayContainer will not be allowed while a Modal is open.
      const linkContainer = document.getElementById(OVERLAY_CONTAINER_ID) || document.body;
      linkContainer.appendChild(link);
      // prevent file downloading on testing env
      if (process.env.NODE_ENV !== 'test') {
        window.setTimeout(() => {
          const currentFocused = document.activeElement;
          link.click();
          currentFocused.focus();
          linkContainer.removeChild(link);
        }, 50);
      }// Need to debounce this click event from others (Pane actionMenuItems dropdown)
    } else {
      console.error('Failed to trigger download for CSV data'); // eslint-disable-line no-console
    }
  }
}

// Returns an array of all nested keys in an object
// Ignoring next block in test coverage since it is currently unused
// istanbul ignore next
const keyify = (obj, prefix = '') => Object.keys(obj).reduce((res, el) => {
  if (Array.isArray(obj[el])) {
    return res;
  } else if (typeof obj[el] === 'object' && obj[el] !== null) {
    return [...res, ...keyify(obj[el], prefix + el + '.')];
  } else {
    return [...res, prefix + el];
  }
}, []);

// Ignoring next block in tests since we don't have a great way to suppress downloads in tests
// istanbul ignore next
class FieldList {
  constructor(objectArray, onlyFields = []) {
    this.list = onlyFields.length ? onlyFields : keyify(objectArray[0]);
  }

  omit = (excludedFields = []) => {
    excludedFields.forEach((field) => {
      const index = this.list.indexOf(field);
      if (index !== -1) {
        this.list.splice(index, 1);
      }
    });
    return this;
  }

  ensureToInclude = (includedFields = []) => {
    includedFields.forEach((field) => {
      const index = this.list.indexOf(field);
      if (index === -1) {
        this.list.push(field);
      }
    });
    return this;
  }
}

// Ignoring next block in tests since we don't have a great way to suppress downloads in tests
// istanbul ignore next
export default function exportToCsv(objectArray, opts) {
  if (!(objectArray && objectArray.length > 0)) {
    // console.debug('No data to export');
    return;
  }
  let options = opts;
  if (Array.isArray(opts)) { // backwards-compatiblity
    options = { excludeFields: opts };
  }

  const {
    excludeFields,           // do not include these fields
    explicitlyIncludeFields, // ensure to include these fields
    onlyFields,              // Only Fields to be included
    filename,                // Custom filename
    header = true,           // turn off/on header adding
  } = options;

  // The default behavior is to use the keys on the first object as the list of fields
  const fields = new FieldList(objectArray, onlyFields)
    .omit(excludeFields)
    .ensureToInclude(explicitlyIncludeFields).list;

  const parser = new Parser({ fields, flatten: true, header });
  const csv = parser.parse(objectArray);
  triggerDownload(csv, filename);
}
