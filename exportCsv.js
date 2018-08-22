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

// Returns the first list with the values of the second list omitted
const omitFields = (allFields, excludedFields) => {
  excludedFields.forEach((field) => {
    const index = allFields.indexOf(field);
    if (index !== -1) {
      allFields.splice(index, 1);
    }
  });
  return allFields;
};

export default function exportToCsv(objectArray, excludedFields = []) {
  if (!(objectArray && objectArray.length > 0)) {
    // console.debug('No data to export');
    return;
  }

  const allFields = keyify(objectArray[0]);
  const fields = omitFields(allFields, excludedFields);
  const parser = new Parser({ fields });
  const csv = parser.parse(objectArray);
  triggerDownload(csv);
}
