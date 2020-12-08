import { getContent, parseNumber } from "./utils";

const content = getContent().map((val) => {
    const [op, numberString] = val.split(" ");
    const number = parseNumber(numberString);
    return [op, number] as const;
});

let acc = 0;
let currentLine = 0;
const visited = new Set<number>();

// Part I
// while (!visited.has(currentLine)) {
//     visited.add(currentLine);
//     const [op, number] = content[currentLine];
//     switch (op) {
//         case "nop":
//             currentLine++;
//             break;
//         case "acc":
//             acc += number;
//             currentLine++;
//             break;
//         case "jmp":
//             currentLine += number;
//         default:
//             break;
//     }
// }

// console.log(acc);

// Part II
/**
 * We need to change a "nop" or a "jmp" that is found on the first cycle
 * (if we change outside the cycle it won't be reached)
 * If after changing we end up again on the cycle, or on any previous cycle
 * then the solution is not good
 *
 * - find the first cycle as in Part I
 * - save "nop" and "jmp" positions in a queue
 * - try each one and mark all positions as visited (this guarantees linear time exploration)
 * - one of them will be the right one
 */

interface ILocation {
    position: number;
    startingAcc: number;
}

const changeableOpsLocations: Array<ILocation> = [];

function addLoction(position: number, startingAcc: number) {
    changeableOpsLocations.push({ position, startingAcc });
}

while (!visited.has(currentLine)) {
    visited.add(currentLine);
    const [op, number] = content[currentLine];
    switch (op) {
        case "nop":
            addLoction(currentLine, acc);
            currentLine++;
            break;
        case "acc":
            acc += number;
            currentLine++;
            break;
        case "jmp":
            addLoction(currentLine, acc);
            currentLine += number;
        default:
            break;
    }
}

function solveFrom(currentLine: number, acc: number) {
    while (!visited.has(currentLine) && currentLine < content.length) {
        visited.add(currentLine);
        const [op, number] = content[currentLine];
        switch (op) {
            case "nop":
                currentLine++;
                break;
            case "acc":
                acc += number;
                currentLine++;
                break;
            case "jmp":
                currentLine += number;
            default:
                break;
        }
    }
    return [currentLine, acc];
}

for (let startPos = 0; startPos < changeableOpsLocations.length; startPos++) {
    const { position, startingAcc } = changeableOpsLocations[startPos];
    const [op, number] = content[position];
    let result: number[] | [any, any];
    if (op === "jmp") {
        result = solveFrom(position + 1, startingAcc);
    } else {
        result = solveFrom(position + number, startingAcc);
    }
    const [finalPos, finalAcc] = result;
    if (finalPos === content.length) {
        console.log(finalAcc);
        break;
    }
}
