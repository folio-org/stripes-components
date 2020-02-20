/*
* Utility function that returns a object with all values set to true(expanded) or false (collapsed).
* Status : object containing keys matched to cooresponding accordion Id's
* expand : boolean - weather to expand or contract all accordions within the object.
*/

export default function ExpandCollapseAll(status, expand = false) {
  const newStatus = {};
  Object.keys(status).forEach(s => { newStatus[s] = expand; });
  return newStatus;
}
