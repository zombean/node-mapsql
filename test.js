const { load } = require("./mapsqlite.js");
console.log("loading map 'test'");
const map = load("test");
console.log("assigning world to hello");
map.set("hello", "world");
const value = map.get("hello");
console.log("hello value:", value);
if(value === "world") console.log("test succesful!");
else console.warn("something went wrong!");
