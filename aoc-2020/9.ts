import { getContent, parseNumber } from "./utils";

const content = getContent().map(parseNumber);

const segmentLength = 25;
const usable = {};

function incrementValue(value: number) {
    if (usable[value] == null) {
        usable[value] = 0;
    }
    usable[value]++;
}

for (let idx = 0; idx < segmentLength; ++idx) {
    const val = content[idx];
    incrementValue(val);
}

let result1 = -1;
// Part I
for (let idx = segmentLength; idx < content.length; ++idx) {
    const val = content[idx];
    let found = false;
    for (let idy = idx - 1; idy >= idx - segmentLength; --idy) {
        const prevVal = content[idy];
        if (
            val - prevVal !== prevVal &&
            usable[val - prevVal] != null &&
            usable[val - prevVal] !== 0
        ) {
            found = true;
            break;
        }
    }
    usable[content[idx - segmentLength]]--;
    incrementValue(val);
    if (!found) {
        console.log(val);
        result1 = val;
        break;
    }
}

let end = 0,
    sum = 0;
const deque = [];
while (sum !== result1) {
    while (sum < result1) {
        const val = content[end];
        sum += val;
        deque.push(val);
        ++end;
    }
    if (sum === result1) {
        break;
    }
    sum -= deque.shift();
}
if (sum === result1) {
    const minVal = Math.min(...deque);
    const maxVal = Math.max(...deque);
    console.log(minVal + maxVal);
}
