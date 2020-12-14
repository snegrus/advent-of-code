import { getContent } from "./utils";
import {
    applyMaskToNumber,
    generateMasks,
    getAssignmentFromString,
    getMaskFromString,
    getNumberAsMask,
    getNumberFromMask,
} from "./utils14";

// Part I
// const lines = getContent();
// const memory: { [key: number]: number[] } = {};
// let mask = [];
// lines.forEach((line) => {
//     if (line.startsWith("mask")) {
//         mask = getMaskFromString(line);
//     } else {
//         const [pos, val] = getAssignmentFromString(line);
//         memory[pos] = applyMaskToNumber(mask, getNumberAsMask(val));
//     }
// });

// let result = 0;
// Object.values(memory).forEach((value) => {
//     result += getNumberFromMask(value);
// });
// console.log(result);

const lines = getContent();
const memory: { [key: number]: number } = {};
let mask: (number | "X")[] = [];
lines.forEach((line) => {
    if (line.startsWith("mask")) {
        mask = getMaskFromString(line);
    } else {
        const [key, val] = getAssignmentFromString(line);
        const iterator = generateMasks(mask, getNumberAsMask(key));
        do {
            const { done, value: pos } = iterator.next();
            if (pos) {
                memory[pos] = val;
            }
            if (done) {
                break;
            }
        } while (true);
    }
});

let result = 0;
Object.values(memory).forEach((value) => {
    result += value;
});
console.log(result);
