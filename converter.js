const jsonfile = require('jsonfile');
const fs = require('fs');

/**
 * ===========================
 * Command line interface
 * ===========================
 */

// Extract command line arguments
const input = process.argv.splice(2);
const [jsonFilename, sqlFilename] = input;
parseIfNotExist();
/**
 * ===========================
 * Implementation
 * ===========================
 */

function parseIfNotExist(){
  fs.open(sqlFilename, 'r', function (fileNotExist, _) {
    if (fileNotExist) {
      converter(input);
    } else {
      console.log("output file already exists!");
    }
  })
}

function converter(input) {

  // exit if json or sql files are not specified
  if (!jsonFilename || !sqlFilename) return 'Error';

  const tables = [];
  var columns = [];
  var columnTypes = [];
  var columnInfo = [];
  var values = [];
  const valueInserts = [];
  const createTables = [];

  // use jsonfile module to read json file
  jsonfile.readFile(jsonFilename, (err, data) => {
    if (err) return console.error(err);

    const source = data.Data.Data;
    fetchTables(source);
    for (let i = 0; i < tables.length; i++) {
      const tableItem = source[tables[i]];
      if (Array.isArray(tableItem)) {
        parseArray(tableItem, i);
      }
      else if (typeof (tableItem) == "object") {
        parseObject(tableItem, i);
      }
    }
    const creates = toSql(createTables);
    const inserts = toSql(valueInserts);
    const combinedSql = creates.concat(`\n` + inserts)

    writeOutput(combinedSql)
  });

  function fetchTables(source) {
    for (var i in source) {
      tables.push(i);
    }
  }

  function parseArray(tableItem, index) {
    for (var i = 0; i < tableItem.length; i++) {
      convertObject(tableItem[i]);
      if (i == 1) {
        columnInfo = []
        parseColumnInfo()
        createTables.push(`CREATE TABLE IF NOT EXISTS ${tables[index]} (${columnInfo})`)
      }
      const query = `INSERT INTO ${tables[index]} (${columns}) VALUES (${values})`;
      valueInserts.push(query)
    }
  }

  function parseObject(tableItem, index) {
    convertObject(tableItem)
    parseColumnInfo()
    createTables.push(`CREATE TABLE IF NOT EXISTS ${tables[index]} (${columnInfo})`)
    const query = `INSERT INTO ${tables[index]} (${columns}) VALUES (${values})`
    valueInserts.push(query)
  }

  function convertObject(item) {
    columns = [];
    values = [];
    for (var i in item) {
      columns.push(i);
      let value = item[i]
      if (typeof value === 'string') {
        value = "\"" + value + "\"";
      }
      if (value == null) {
        value = "\"\""
      }
      values.push(value);
    }
  }

  function parseColumnInfo() {
    for (var i = 0; i < columns.length; i++) {
      if (typeof (values[i]) == "string") {
        columnTypes = "TEXT"
        columnInfo.push(`${columns[i]} ${columnTypes}`)
      }
      else if (typeof (values[i]) == "number") {
        columnTypes = "INTERGER"
        columnInfo.push(`${columns[i]} ${columnTypes}`)
      }
    }
  }
 
  function toSql(queries) {
    return queries.join(`;\n`) + ';';
  }

  function writeOutput(combinedSql) {
    fs.writeFile(sqlFilename, combinedSql, (err2) => {
      if (err2) return console.error(err2);
      console.log('Done');
    });
  }
}