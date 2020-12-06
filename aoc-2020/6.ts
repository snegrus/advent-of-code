import { getContent } from "./utils";

const groups = getContent("\n\n");

// Part I
// let result = 0;
// groups.forEach((group) => {
//     const found = new Map<string, boolean>();
//     group
//         .split("\n")
//         .forEach((entry) =>
//             entry.split("").forEach((char) => found.set(char, true))
//         );
//     result += found.size;
// });

let result = 0;
groups.forEach((group) => {
    const found = new Map<string, number>();
    const entries = group.split("\n").filter((val) => val.length !== 0);
    entries.forEach((entry) =>
        entry.split("").forEach((char) => {
            const nextVal = (found.get(char) || 0) + 1;
            found.set(char, nextVal);
        })
    );
    found.forEach((val) => (result += val === entries.length ? 1 : 0));
});

console.log(result);
