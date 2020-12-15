import { getContent, parseNumber } from "./utils";

const content = getContent()[0].split(",").map(parseNumber);
const found = new Map();
content.forEach((x, idx) => {
    found.set(x, idx);
});
let prev = content[content.length - 1];
found.delete(prev);
console.log(new Date().toISOString());
for (let i = content.length; i < 30000000; i++) {
    let x = 0;
    if (!found.has(prev)) {
        x = 0;
    } else {
        x = i - 1 - found.get(prev);
    }
    found.set(prev, i - 1);
    prev = x;
}

console.log(prev);
console.log(new Date().toISOString());
