# JSON to SQL converter

### Setup
* `cd json-to-sql`
*  `npm i`

### usage
`node converter.js path-to-input.json path-to-output.sql`

### Limitations

Parses only below schema from json
>       {
>          "tableName": "tableContents"//this can be an array of another object or just an object
>       }

### Example

>input.json
```json
{
    "User": [
        {
            "id": 123,
            "name": "username1"
        },
        {
            "id": 321,
            "name": "username2"
        }
    ],
    "Address": {
        "city": "Chennai",
        "state": "Tamilnadu"
    }
}
```

>output.sql
```sql
CREATE TABLE IF NOT EXISTS User (id INTERGER,name TEXT);
CREATE TABLE IF NOT EXISTS Address (id INTERGER,name TEXT,city TEXT,state TEXT);
INSERT INTO User (id,name) VALUES (123,"username1");
INSERT INTO User (id,name) VALUES (321,"username2");
INSERT INTO Address (city,state) VALUES ("Chennai","Tamilnadu");
```