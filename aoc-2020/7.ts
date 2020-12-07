import { getContent, parseNumber, prettyPrint } from "./utils";

const lines = getContent();

// Part I
// Need a graph A -> [B, C] , A can be inside B, C (reverse the direction)
// will dfs/bfs from "shiny gold" to all reachable and count
// const graph: { [key: string]: Set<string> } = {};
// lines.forEach((line) => {
//     // console.group(`--- start froms ${line}`);
//     const [toSide, fromSide] = line.split(" contain ");
//     // console.log([toSide, fromSide]);
//     const toColor = toSide.match(/^([a-z ]+) bags$/)[1]; // "<toColor> bags"
//     // console.log(`"${toColor}"`);
//     const fromColors = [];
//     if (fromSide.startsWith("no")) {
//         console.groupEnd();
//         return;
//     }
//     fromSide.split(/, ?/).forEach((fromEntry) => {
//         // const found = fromEntry.match(/^[0-9]+ ([a-z ]+) bags?\.?$/);
//         // console.log(`"${fromEntry}"`, found);
//         const fromColor = fromEntry.match(/^[0-9]+ ([a-z ]+) bags?\.?$/)[1];
//         fromColors.push(fromColor);
//     });
//     fromColors.forEach((fromColor) => {
//         if (graph[fromColor] == null) {
//             graph[fromColor] = new Set();
//         }
//         graph[fromColor].add(toColor);
//     });
//     // console.log(fromColors);
//     // console.groupEnd();
// });

// const origin = "shiny gold";
// const visited = new Set<string>();
// visited.add(origin);
// const queue = [];
// queue.push(origin);
// while (queue.length !== 0) {
//     const from = queue[0];
//     queue.shift();
//     if (graph[from] != null) {
//         graph[from].forEach((to) => {
//             if (!visited.has(to)) {
//                 visited.add(to);
//                 queue.push(to);
//             }
//         });
//     }
// }
// console.log(visited.size - 1); // do not count the "shiny gold"

// Part II
// Need a graph A -> [B, C] , where B, C can be inside A (keep direction)
// will dfs/bfs from "shiny gold" to all reachable and count the children
// to compute the result of a child we have to find the result for all its children
// will save the solution for each child to reuse the result (dynamic programming)
interface IGraphNode {
    toColor: string;
    count: number;
}

const graph: { [key: string]: IGraphNode[] } = {};
lines.forEach((line) => {
    const [fromSide, toSide] = line.split(" contain ");
    const fromColor = fromSide.match(/^([a-z ]+) bags$/)[1]; // "<fromColor> bags"
    if (toSide.startsWith("no")) {
        return;
    }
    graph[fromColor] = toSide.split(/, ?/).map((toEntry) => {
        const [ignored, count, toColor] = toEntry.match(
            /^([0-9]+) ([a-z ]+) bags?\.?$/
        );
        return { toColor, count: parseNumber(count) };
    });
});

const origin = "shiny gold";
const result: { [key: string]: number } = {};

function solve(currentColor: string) {
    let currentResult = 1;
    if (graph[currentColor] == null || graph[currentColor].length === 0) {
        result[currentColor] = currentResult;
        return;
    }
    graph[currentColor].forEach(({ toColor, count }) => {
        if (typeof result[toColor] !== "number") {
            solve(toColor);
        }
        currentResult += count * result[toColor];
    });
    result[currentColor] = currentResult;
}
solve(origin);
console.log(result[origin] - 1); // do not count the "shiny gold"
