import { getContent, parseNumber } from "./utils";

const content = getContent().map((line) =>
    line.split("").map((char) => (char === "#" ? 1 : 0))
);

const states: Array<Map<string, number>> = [new Map()];
// Part I
// const z = 0;
// content.forEach((line, x) => {
//     line.forEach((elem, y) => {
//         if (elem) {
//             const key = `${x},${y},${z}`;
//             states[0].set(key, 1);
//         }
//     });
// });

// let cnt = 6,
//     from = 0,
//     to = 1;
// while (cnt--) {
//     states[to] = new Map();
//     const destination = states[to];
//     const source = states[from];

//     const explore = (x: number, y: number, z: number) => {
//         for (let i = x - 1; i <= x + 1; i++) {
//             for (let j = y - 1; j <= y + 1; j++) {
//                 for (let k = z - 1; k <= z + 1; ++k) {
//                     if (i === x && j === y && k === z) {
//                         continue;
//                     }
//                     const key = `${i},${j},${k}`;
//                     if (!destination.has(key)) {
//                         destination.set(key, 0);
//                     }
//                     destination.set(key, 1 + destination.get(key));
//                 }
//             }
//         }
//     };

//     source.forEach((val, key) => {
//         const [x, y, z] = key.split(",").map(parseNumber);
//         explore(x, y, z);
//     });

//     const inactiveKeys = [];
//     destination.forEach((value, key) => {
//         const isActive = source.has(key);
//         if (isActive && (value < 2 || value > 3)) {
//             inactiveKeys.push(key);
//         }
//         if (!isActive && value !== 3) {
//             inactiveKeys.push(key);
//         }
//     });
//     inactiveKeys.forEach((key) => {
//         destination.delete(key);
//     });

//     [from, to] = [to, from];
// }
// console.log(states[from].size);

// Part II
content.forEach((line, x) => {
    line.forEach((elem, y) => {
        if (elem) {
            const key = `${x},${y},0,0`;
            states[0].set(key, 1);
        }
    });
});

let cnt = 6,
    from = 0,
    to = 1;
while (cnt--) {
    states[to] = new Map();
    const destination = states[to];
    const source = states[from];

    const explore = (x: number, y: number, z: number, q: number) => {
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                for (let k = z - 1; k <= z + 1; ++k) {
                    for (let p = q - 1; p <= q + 1; ++p) {
                        if (i === x && j === y && k === z && p === q) {
                            continue;
                        }
                        const key = `${i},${j},${k},${p}`;
                        if (!destination.has(key)) {
                            destination.set(key, 0);
                        }
                        destination.set(key, 1 + destination.get(key));
                    }
                }
            }
        }
    };

    source.forEach((val, key) => {
        const [x, y, z, q] = key.split(",").map(parseNumber);
        explore(x, y, z, q);
    });

    const inactiveKeys = [];
    destination.forEach((value, key) => {
        const isActive = source.has(key);
        if (isActive && (value < 2 || value > 3)) {
            inactiveKeys.push(key);
        }
        if (!isActive && value !== 3) {
            inactiveKeys.push(key);
        }
    });
    inactiveKeys.forEach((key) => {
        destination.delete(key);
    });

    [from, to] = [to, from];
}
console.log(states[from].size);
