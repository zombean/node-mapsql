const db = require('better-sqlite3')('sqlmap.db', {verbose: sqlite3_log});

const table_exists_query = db.prepare(`SELECT EXISTS (SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?);`);

function sqlite3_log(...args) {
  log(...args);
}

function log(...args) {
}

function verbose(func) {
  if(typeof func === "function") log = func;
  else throw new Error(`Expected function got ${typeof func} instead`);
}

function table_exists(table_name) {
  try {
    return Object.values(table_exists_query.get(table_name))[0] !== 0;
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

  const get_query = db.prepare(`SELECT value FROM ${table_name} WHERE id = ?`);

  function get(key) {
    if(typeof key !== "string") throw new Error(`key is ${typeof key}, expecting string`);
    const result = get_query.get(key);
    return result ? result.value : undefined;
  }

  const find_query = db.prepare(`SELECT id FROM ${table_name} WHERE value = ?`);

  function find(value) {
    if (typeof value !== "string") throw new Error(`value is ${typeof value}, expecting string`);
    const rows = find_query.all(value);
    return rows.map(row => row.id);
  }

  const set_find = db.prepare(`SELECT EXISTS (SELECT 1 FROM ${table_name} WHERE id = ?)`);
  const update = db.prepare(`UPDATE ${table_name} SET value = ? WHERE id = ?`);
  const insert = db.prepare(`INSERT INTO ${table_name} (id, value) VALUES (?, ?)`);

  function set(key, value) {
    if(typeof key !== "string") throw new Error(`key is ${typeof key}, expecting string`);
    if(typeof value !== "string") throw new Error(`value is ${typeof key}, expecting string`);
    
    const exists = Object.values(set_find.get(key))[0] !== 0;
    if (exists) {
      update.run(value, key);
    } else {
      insert.run(key, value);
    }
  }

  return { get, set, find };
}

process.on('exit', () => {
  if (db) {
    db.close();
  }
});

module.exports = { load, verbose };