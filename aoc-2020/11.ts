import { stat } from "fs";
import { exit } from "process";
import { getContent, prettyPrint } from "./utils";

const states: string[][][] = [];
states[0] = getContent().map((line) => line.split(""));

states[1] = [];
states[0].forEach((val: any, idx: string | number) => {
    states[1][idx] = [];
});

function printTable(table: string[][]) {
    table.forEach((line) => console.log(line.join("")));
}

const step = [
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
];

// Part I
// function getSumForLocation(state: string[][], x: number, y: number) {
//     let result = 0;
//     step.forEach(([sx, sy]) => {
//         const nextx = x + sx;
//         const nexty = y + sy;
//         if (
//             0 <= nextx &&
//             nextx < state.length &&
//             0 <= nexty &&
//             nexty < state[0].length
//         ) {
//             result = result + (state[nextx][nexty] === "#" ? 1 : 0);
//         }
//     });
//     return result;
// }

// let areDifferent = false;
// let from = 0,
//     to = 1;
// do {
//     areDifferent = false;
//     for (let i = 0; i < states[from].length; i++) {
//         for (let j = 0; j < states[from][i].length; ++j) {
//             const loc = states[from][i][j];
//             const sum = getSumForLocation(states[from], i, j);
//             if (loc === "L" && sum === 0) {
//                 states[to][i][j] = "#";
//             } else if (loc === "#" && sum >= 4) {
//                 states[to][i][j] = "L";
//             } else {
//                 states[to][i][j] = loc;
//             }
//             if (states[to][i][j] != loc) {
//                 areDifferent = true;
//             }
//         }
//     }
//     [from, to] = [to, from];
// } while (areDifferent);

// let result = 0;
// states[0].forEach((line) =>
//     line.forEach((loc) => (result += loc === "#" ? 1 : 0))
// );
// console.log(result);

function getSumForLocation(state: string[][], x: number, y: number) {
    let result = 0;
    step.forEach(([sx, sy]) => {
        let nextx = x + sx;
        let nexty = y + sy;

        while (
            0 <= nextx &&
            nextx < state.length &&
            0 <= nexty &&
            nexty < state[0].length
        ) {
            const isOccupied = state[nextx][nexty] === "#";
            const isSeat = state[nextx][nexty] === "L";
            if (isOccupied) {
                ++result;
                break;
            }
            if (isSeat) {
                break;
            }
            nextx += sx;
            nexty += sy;
        }
    });
    return result;
}

let areDifferent = false;
let from = 0,
    to = 1;
do {
    areDifferent = false;
    for (let i = 0; i < states[from].length; i++) {
        for (let j = 0; j < states[from][i].length; ++j) {
            const loc = states[from][i][j];
            const sum = getSumForLocation(states[from], i, j);
            if (loc === "L" && sum === 0) {
                states[to][i][j] = "#";
            } else if (loc === "#" && sum >= 5) {
                states[to][i][j] = "L";
            } else {
                states[to][i][j] = loc;
            }
            if (states[to][i][j] != loc) {
                areDifferent = true;
            }
        }
    }
    // printTable(states[to]);
    // console.log("\n");
    [from, to] = [to, from];
} while (areDifferent);

let result = 0;
states[0].forEach((line) =>
    line.forEach((loc) => (result += loc === "#" ? 1 : 0))
);
console.log(result);
