import { getContent, parseNumber } from "./utils";

// matrix positioning not cartezian
//          north       (x, y)
//           -1 x
//            |
// west -1 - 0,0 - +1 east
// y          |
//           +1
//          south

const content = getContent().map((line) => {
    const char = line[0];
    const number = parseNumber(line.substr(1));
    return [char, number] as const;
});

const directions = [
    ["N", -1, 0],
    ["E", 0, 1],
    ["S", 1, 0],
    ["W", 0, -1],
] as const;

const rotations = {
    L: -1,
    R: 1,
};

let shipx = 0,
    shipy = 0,
    shipDirection = 1;

// Part I
// content.forEach(([char, number]) => {
//     if (["L", "R"].includes(char)) {
//         const rotation = rotations[char];
//         const quadrants = number / 90;
//         shipDirection = (((shipDirection + rotation * quadrants) % 4) + 4) % 4;
//     } else if (char === "F") {
//         const [_ignored, addx, addy] = directions[shipDirection];
//         shipx += number * addx;
//         shipy += number * addy;
//     } else {
//         const [_ignored, addx, addy] = directions.find(
//             (tuple) => tuple[0] === char
//         );
//         shipx += number * addx;
//         shipy += number * addy;
//     }
// });

// console.log(Math.abs(shipx) + Math.abs(shipy));

// Part II
let waypointx = -1,
    waypointy = 10;
content.forEach(([char, number]) => {
    if (["L", "R"].includes(char)) {
        let moves = (number / 90) % 4;
        while (moves--) {
            if (char === "L") {
                [waypointx, waypointy] = [waypointy, waypointx];
            }
            waypointx *= -1;
            if (char === "R") {
                [waypointx, waypointy] = [waypointy, waypointx];
            }
        }
    } else if (char === "F") {
        shipx += number * waypointx;
        shipy += number * waypointy;
    } else {
        const [_ignored, addx, addy] = directions.find(
            (tuple) => tuple[0] === char
        );
        waypointx += number * addx;
        waypointy += number * addy;
    }
});

console.log(`ship: ${shipx} ${shipy}`);
console.log(`waypoint: ${waypointx} ${waypointy}`);

console.log(Math.abs(shipx) + Math.abs(shipy));

// L90: (-1, 2) -> (-2, -1) -> (1, -2) -> (2, 1) | swap and multiple x by -1
// R90: (-1, 2) -> (2, 1) -> (1, -2) -> (-2, -1) | multiply x by -1 and swap
