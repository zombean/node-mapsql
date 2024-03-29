## Simple Key-Value Storage Function

This Node.js module exports a single function, `load(table_name)`, that provides easy access to a key-value storage system backed by an SQLite database.

**Function:**

- `load(table_name)`:
    - Takes the name of a table (assumed to exist in the database and creates if not).
    - Returns an object with three methods:
        - `set(key, value)`: Sets the value for the given key. If the key doesn't exist, it creates a new entry.
        - `get(key)`: Retrieves the value associated with the given key and undefined if key doesn't exist.
        - `find(value)`: Returns all keys for the given value in an array.

**Usage:**

`npm install mapsqlite`

```javascript
const { load } = require("mapsqlite");
const myMap = load("1337");

console.log("hello:", myMap.get("hello"));
//hello: undefined

myMap.set("hello", "world");
console.log("hello:", myMap.get("hello"));
//hello: world

console.log(myMap.find("world"));
//["hello"]
```
