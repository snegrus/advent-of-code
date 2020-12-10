import { getContent, parseNumber, prettyPrint } from "./utils";

const content = getContent().map(parseNumber);
content.unshift(0);
content.sort((a, b) => a - b);
content.push(content[content.length - 1] + 3);

// Part I
// let dif1 = 0,
//     dif3 = 1;
// // prettyPrint(content);
// for (let i = 1; i < content.length; ++i) {
//     const diff = content[i] - content[i - 1];
//     if (diff === 1) {
//         dif1++;
//     }
//     if (diff === 3) {
//         dif3++;
//     }
//     if (diff === 0) {
//         console.log("equal elements");
//     }
// }
// console.log(`${dif1} * ${dif3}`);
// console.log(dif1 * dif3);

// Part II
const solution = [];
solution[0] = 1;

console.log(solution);
for (let i = 1; i < content.length; ++i) {
    solution[i] = 0;
    for (let j = i - 1; j >= 0 && content[i] - content[j] < 4; --j) {
        solution[i] += solution[j];
    }
}
console.log(solution.pop());
