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
const keyValueStorage = load("myTable");

const value = keyValueStorage.get("myKey");
if (value) {
  console.log("Value:", value);
} else {
  console.log("Key not found.");
}

keyValueStorage.set("anotherKey", "new value");
