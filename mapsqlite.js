const db = require('better-sqlite3')('sqlmap.db');

function log(...args) {
}

function verbose(func) {
  if(typeof func === "function") log = func;
  else throw new Error(`Expected function got ${typeof func} instead`);
}

function table_exists(table_name) {
  try {
    const query = db.prepare(`SELECT EXISTS (SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?);`);
    return Object.values(query.get(table_name))[0] !== 0;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function table_create(table_name) {

  if (table_exists(table_name)) {
    log(`Table '${table_name}' already exists, skipping creation.`);
    return;
  }

  const createTableSql = `
    CREATE TABLE ${table_name} (
      id TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `;

  try {
    db.exec(createTableSql);
    log(`Table '${table_name}' created successfully.`);
  } catch (error) {
    console.error(`Error creating table '${table_name}':`, error);
  }
}

function load(table_name) {
  if (!table_exists(table_name)) table_create(table_name);

  function get(key) {
    if(typeof key !== "string") throw new Error(`key is ${typeof key}, expecting string`);
    const query = db.prepare(`SELECT value FROM ${table_name} WHERE id = ?`);
    const result = query.get(key);
    return result ? result.value : undefined;
  }

  function set(key, value) {
    if(typeof key !== "string") throw new Error(`key is ${typeof key}, expecting string`);
    if(typeof value !== "string") throw new Error(`value is ${typeof key}, expecting string`);
    const query = db.prepare(`SELECT EXISTS (SELECT 1 FROM ${table_name} WHERE id = ?)`).get(key);
    const exists = Object.values(query)[0] !== 0;
    if (exists) {
      db.prepare(`UPDATE ${table_name} SET value = ? WHERE id = ?`).run(value, key);
    } else {
      db.prepare(`INSERT INTO ${table_name} (id, value) VALUES (?, ?)`).run(key, value);
    }
  }

  return { get, set };
}

process.on('exit', () => {
  if (db) {
    db.close();
  }
});

module.exports = { load, verbose };