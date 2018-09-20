import { Parser } from 'json2csv';

function triggerDownload(csv, fileTitle) {
  const exportedFilename = fileTitle ? fileTitle + '.csv' : 'export.csv';
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, exportedFilename);
  } else {
    const link = document.createElement('a');
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', exportedFilename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      window.setTimeout(() => {
        link.click();
        document.body.removeChild(link);
      }, 50); // Need to debounce this click event from others (Pane actionMenuItems dropdown)
    } else {
      console.error('Failed to trigger download for CSV data'); // eslint-disable-line no-console
    }
  }
}

// Returns an array of all nested keys in an object
const keyify = (obj, prefix = '') => Object.keys(obj).reduce((res, el) => {
  if (Array.isArray(obj[el])) {
    return res;
  } else if (typeof obj[el] === 'object' && obj[el] !== null) {
    return [...res, ...keyify(obj[el], prefix + el + '.')];
  } else {
    return [...res, prefix + el];
  }
}, []);

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
export default function exportToCsv(objectArray, options) {
  if (!(objectArray && objectArray.length > 0)) {
    // console.debug('No data to export');
    return;
  }
  const {
    excludeFields,           // do not include these fields
    explicitlyIncludeFields, // ensure to include these fields
    onlyFields               // only use these fields
  } = options;

  // The default behavior is to use the keys on the first object as the list of fields

  const fields = new FieldList(objectArray, onlyFields)
    .omit(excludeFields)
    .ensureToInclude(explicitlyIncludeFields).list;

  const parser = new Parser({ fields });
  const csv = parser.parse(objectArray);
  triggerDownload(csv);
}
