## Simple Key-Value Storage Function

This Node.js module exports a single function, `load(table_name)`, that provides easy access to a key-value storage system backed by an SQLite database.

**Function:**

- `load(table_name)`:
    - Takes the name of a table (assumed to exist in the database and creates if not).
    - Returns an object with two methods:
        - `get(key)`: Retrieves the value associated with the given key and undefined if key doesn't exist.
        - `set(key, value)`: Sets the value for the given key. If the key doesn't exist, it creates a new entry.

**Usage:**

```javascript
const myMap = load("1337");
console.log("hello:", myMap.get("hello"));
myMap.set("hello", "world");
console.log("hello:", myMap.get("hello"));
//hello: undefined
//hello: world
```