# JSON to SQL converter

### Setup
* `cd json-to-sql`
*  `npm i`

### usage
`node converter.js path-to-input.json path-to-output.sql`

### Limitations

Parse only below schema from json
>       {
>          "tableName": "tableContents"//this can be an array of another object or just an object
>       }