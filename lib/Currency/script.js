const https = require('https');
const xml2js = require('xml2js');
const fs = require('fs');

const url = 'https://www.currency-iso.org/dam/downloads/lists/list_one.xml';

const toMap = (xml) => {
  const currencyMap = {};
  const parser = new xml2js.Parser();
  parser.parseString(xml, (err, result) => {
    result.ISO_4217.CcyTbl[0].CcyNtry.forEach(entry => {
      if (entry.Ccy && entry.CcyNm) {
        if (typeof entry.CcyNm[0] === 'string') {
          currencyMap[entry.Ccy[0]] = entry.CcyNm[0];
        }
      }
    });
  });

  // remove the following because they are experimental, non-cash, etc
  const rm = ['XBA', 'XBB', 'XBC', 'XBD', 'XTS', 'XXX', 'XAU', 'XPD', 'XPT', 'XAG'];
  rm.forEach(i => delete currencyMap[i]);

  return currencyMap;
};

//
// write list to file as exported array
// @clist array ordered list of currency keys
// @filename string name of file to write; it will be created if necessary
//
const writeList = (clist, filename) => {
  fs.writeFileSync(
    filename,
    `// THIS FILE WAS AUTOMATICALLY GENERATED FROM
// ${url}
// at ${new Date()}

export default ${JSON.stringify(clist)};
`
  );
};

//
// write currency translations file as JSON
// @clist array ordered list of currency keys
// @cmap object map from currency key to English name
// @filename string name of file to write; it will be created if necessary
// @prefix string prefix for translation keys
const writeTranslations = (clist, cmap, filename, prefix = '') => {
  fs.writeFileSync(
    filename,
    `{
${clist.map(i => `  "${prefix && `${prefix}.`}${i}": "${cmap[i]}"`).join(',\n')}
}
`
  );
};

https.get(url, (res) => {
  let xml = '';
  res.on('data', (chunk) => {
    xml += chunk;
  });

  res.on('end', () => {
    const currencyMap = toMap(xml);

    const currencyList = Object.keys(currencyMap).sort((a, b) => a.localeCompare(b));
    writeList(currencyList, './currencies.js');
    writeTranslations(currencyList, currencyMap, './currencies-en.json');
  });
}).on('error', (e) => {
  console.error(e);
});
