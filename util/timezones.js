/**
 * timezones is an array of { value, name } objects, sorted by value. The list
 * corresponds to officially recognized timezones, plus UTC.
 *
 * These data are derived from public domain data at https://github.com/eggert/tz/,
 * a link totally buried in the documentation at https://www.iana.org/time-zones.
 * This list reflects the v2026b (2026-04-22) release of zonenow.tab.
 *
 * There seem to be ~1-10 updates a year. Consider syncing it yearly or so.
 *
 * While the { value, name } convention seems unfortunate (options like
 * { key, value } or { name, value } seem like obvious improvements), it
 * reflects the fact that an HTML <Select> will have <options> structured like
 *    <option value={computer-string}>{human-string}</option>
 * and its convenient/obvious if the `value` attribute of these entries can
 * map directly to the `value` attribute of the `<option>`.
 *
 */
const timezones = [
  ['Pacific/Pago_Pago', 'Midway; Samoa (SST)'],
  ['Pacific/Niue', 'Niue'],
  ['Pacific/Honolulu', 'Hawaii (HST)'],
  ['Pacific/Tahiti', 'Tahiti; Cook Islands'],
  ['America/Adak', 'western Aleutians in Alaska (HST/HDT)'],
  ['Pacific/Marquesas', 'Marquesas'],
  ['Pacific/Gambier', 'Gambier'],
  ['America/Anchorage', 'most of Alaska (AKST/AKDT)'],
  ['Pacific/Pitcairn', 'Pitcairn'],
  ['America/Los_Angeles', 'Pacific (PST/PDT) - US & Canada; Mexico near US border'],
  ['America/Vancouver', 'MST - BC (most areas)'],
  ['America/Phoenix', 'Mountain Standard (MST) - Arizona; western Mexico; Yukon'],
  ['America/Denver', 'Mountain (MST/MDT) - US & Canada; Mexico near US border'],
  ['Pacific/Galapagos', 'Galápagos'],
  ['America/Mexico_City', 'Central Standard (CST) - Saskatchewan; central Mexico; Central America'],
  ['Pacific/Easter', 'Easter Island'],
  ['America/Chicago', 'Central (CST/CDT) - US & Canada; Mexico near US border'],
  ['America/Lima', 'eastern South America'],
  ['America/Jamaica', 'Eastern Standard (EST) - Caymans; Jamaica; eastern Mexico; Panama'],
  ['America/Havana', 'Cuba'],
  ['America/New_York', 'Eastern (EST/EDT) - US & Canada'],
  ['America/Caracas', 'western South America'],
  ['America/Santo_Domingo', 'Atlantic Standard (AST) - eastern Caribbean'],
  ['America/Santiago', 'most of Chile'],
  ['America/Halifax', 'Atlantic (AST/ADT) - Canada; Bermuda'],
  ['America/St_Johns', 'Newfoundland (NST/NDT)'],
  ['America/Sao_Paulo', 'eastern and southern South America'],
  ['America/Miquelon', 'St Pierre & Miquelon'],
  ['America/Noronha', 'Fernando de Noronha; South Georgia'],
  ['America/Nuuk', 'most of Greenland'],
  ['Atlantic/Cape_Verde', 'Cape Verde'],
  ['Atlantic/Azores', 'Azores'],
  ['Africa/Abidjan', 'far western Africa; Iceland (GMT)'],
  ['Europe/London', 'United Kingdom (GMT/BST)'],
  ['Europe/Lisbon', 'western Europe (WET/WEST)'],
  ['Antarctica/Troll', 'Troll Station in Antarctica'],
  ['Africa/Algiers', 'Algeria, Tunisia (CET)'],
  ['Africa/Lagos', 'western Africa (WAT)'],
  ['Europe/Dublin', 'Ireland (IST/GMT)'],
  ['Africa/Casablanca', 'Morocco'],
  ['Europe/Paris', 'central Europe (CET/CEST)'],
  ['Africa/Maputo', 'central Africa (CAT)'],
  ['Africa/Tripoli', 'Libya; Kaliningrad (EET)'],
  ['Africa/Johannesburg', 'southern Africa (SAST)'],
  ['Europe/Athens', 'eastern Europe (EET/EEST)'],
  ['Africa/Cairo', 'Egypt'],
  ['Asia/Beirut', 'Lebanon'],
  ['Asia/Gaza', 'Palestine'],
  ['Asia/Jerusalem', 'Israel'],
  ['Europe/Istanbul', 'Near East; Belarus'],
  ['Africa/Nairobi', 'eastern Africa (EAT)'],
  ['Europe/Moscow', 'Moscow (MSK)'],
  ['Asia/Tehran', 'Iran'],
  ['Asia/Dubai', 'Russia; Caucasus; Persian Gulf; Seychelles; Réunion'],
  ['Asia/Kabul', 'Afghanistan'],
  ['Asia/Tashkent', 'Russia; Kazakhstan; Tajikistan; Turkmenistan; Uzbekistan; Maldives'],
  ['Asia/Karachi', 'Pakistan (PKT)'],
  ['Asia/Colombo', 'Sri Lanka'],
  ['Asia/Kolkata', 'India (IST)'],
  ['Asia/Kathmandu', 'Nepal'],
  ['Asia/Dhaka', 'Russia; Kyrgyzstan; Bhutan; Bangladesh; Chagos'],
  ['Asia/Yangon', 'Myanmar; Cocos'],
  ['Asia/Bangkok', 'Russia; Indochina; Christmas Island'],
  ['Asia/Jakarta', 'Indonesia (WIB)'],
  ['Asia/Singapore', 'Russia; Brunei; Malaysia; Singapore; Concordia'],
  ['Australia/Perth', 'Western Australia (AWST)'],
  ['Asia/Shanghai', 'China (CST)'],
  ['Asia/Hong_Kong', 'Hong Kong (HKT)'],
  ['Asia/Manila', 'Philippines (PHT)'],
  ['Asia/Makassar', 'Indonesia (WITA)'],
  ['Australia/Eucla', 'Eucla'],
  ['Asia/Chita', 'Russia; Palau; East Timor'],
  ['Asia/Tokyo', 'Japan (JST); Eyre Bird Observatory'],
  ['Asia/Seoul', 'Korea (KST)'],
  ['Asia/Jayapura', 'Indonesia (WIT)'],
  ['Australia/Darwin', 'Northern Territory (ACST)'],
  ['Australia/Adelaide', 'South Australia (ACST/ACDT)'],
  ['Asia/Vladivostok', 'Russia; Yap; Chuuk; Papua New Guinea; Dumont d’Urville'],
  ['Australia/Brisbane', 'Queensland (AEST)'],
  ['Pacific/Guam', 'Mariana Islands (ChST)'],
  ['Australia/Sydney', 'southeast Australia (AEST/AEDT)'],
  ['Australia/Lord_Howe', 'Lord Howe Island'],
  ['Pacific/Bougainville', 'Russia; Kosrae; Bougainville; Solomons'],
  ['Pacific/Norfolk', 'Norfolk Island'],
  ['Asia/Kamchatka', 'Russia; Tuvalu; Fiji; etc.'],
  ['Pacific/Auckland', 'New Zealand (NZST/NZDT)'],
  ['Pacific/Chatham', 'Chatham Islands'],
  ['Pacific/Tongatapu', 'Kanton; Tokelau; Samoa (western); Tonga'],
  ['Pacific/Kiritimati', 'Kiritimati'],
  ['UTC', 'UTC'],
]
  .map(entry => ({ value: entry[0], name: entry[1] }))
  .toSorted((a, b) => a.value.localeCompare(b.value));

export default timezones;
