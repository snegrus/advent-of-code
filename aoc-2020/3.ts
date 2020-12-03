import { getContent } from "./utils";

const content = getContent();

// Part I
// const maxLine = content.length;
// const maxColumn = content[0].length;
// let line = 0,
//     column = 0;
// let result = 0;

// while (line < maxLine) {
//     result += content[line][column] === "#" ? 1 : 0;
//     line += 1;
//     column = (column + 3) % maxColumn;
// }

function countTreesForSlope(
    lineAdd: number,
    columnAdd: number,
    content: string[]
) {
    const maxLine = content.length;
    const maxColumn = content[0].length;
    let line = 0,
        column = 0;
    let result = 0;

    while (line < maxLine) {
        result += content[line][column] === "#" ? 1 : 0;
        line += lineAdd;
        column = (column + columnAdd) % maxColumn;
    }
    return result;
}

const slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
];
let result = 1;
slopes.forEach(([columnAdd, lineAdd]) => {
    result *= countTreesForSlope(lineAdd, columnAdd, content);
});
console.log(result);
