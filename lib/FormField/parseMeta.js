/* A simple function that works both with RF and RFF and takes in the meta prop as its first argument and a
property on the meta object as the second argument and returns its value.

For example: warnings in redux form comes via meta.warning whereas its injected via meta.data.warning in RFF.
*/

// istanbul ignore next
function parseMeta(meta, prop) {
  if (Object.prototype.hasOwnProperty.call(meta, prop)) { // handles booleans and error on RF and RFF
    return meta[prop] ? meta[prop] : '';
  } else if (meta.data) { // handles arbitrary values like `warning` to be placed by mutators in RFF
    return meta.data[prop] ? meta.data[prop] : '';
  }
  return undefined;
}

export default parseMeta;
