import { getContent } from "./utils";

const content = getContent();

function getLocation(input: string, range: number[]) {
    let [start, end] = range;
    input.split("").forEach((char) => {
        const mid = (start + end) / 2;
        if (char === "F") {
            end = mid;
        } else {
            start = mid;
        }
    });
    return start;
}

function getSeatId(input: string) {
    const firstHalf = input.substr(0, 7);
    const secondHalf = input
        .substr(7)
        .split("")
        .map((char) => (char === "L" ? "F" : "B"))
        .join("");
    return (
        getLocation(firstHalf, [0, 128]) * 8 + getLocation(secondHalf, [0, 8])
    );
}

// Part I
// let result = 0;
// content.forEach((input) => {
//     const seatId = getSeatId(input);
//     result = Math.max(result, seatId);
// });

// console.log(result);

// Part II
const ids = content.map(getSeatId);
ids.sort();
for (let idx = 1; idx < ids.length; idx++) {
    if (ids[idx - 1] + 2 === ids[idx]) {
        console.log(ids[idx] - 1);
    }
}
