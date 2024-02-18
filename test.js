let tests = 0;
const total_tests = 2;

const { load } = require("./mapsqlite.js");
console.log("loading map 'test'");
const map = load("test");
console.log("assigning world to hello");
map.set("hello", "world");
const value = map.get("hello");
console.log("hello value:", value);
if(value === "world") tests++;
console.log("searching for 'hello' via 'world'", map.find("world"));
if(map.find("world")[0]==="hello") tests++;
console.log(`${tests}/${total_tests} completed succesfully`);
console.log(`test ${tests===total_tests?'succesful':'failed'}`);
 