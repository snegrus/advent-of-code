import { getContent, parseNumber } from "./utils";

const content = getContent();
// const time = parseNumber(content[0]);
// const buses = content[1]
//     .split(",")
//     .filter((bus) => bus !== "x")
//     .map(parseNumber);

let timeToWait = Infinity;
let chosenBus = 0;

// Part I
// buses.forEach((bus) => {
//     const rounds = Math.floor(time / bus) + (time % bus === 0 ? 0 : 1);
//     const waitingTime = bus * rounds - time;
//     console.log(`${bus} - ${waitingTime}`);
//     if (waitingTime < timeToWait) {
//         timeToWait = waitingTime;
//         chosenBus = bus;
//     }
// });

// console.log(chosenBus * timeToWait);

// Part II
// busses: [busId, idx]
let buses = content[1]
    .split(",")
    .map((bus, idx) => {
        if (bus !== "x") return [parseNumber(bus), idx] as const;
        else return [-1, -1] as const;
    })
    .filter(([val]) => val !== -1);

const lastOffset = buses[buses.length - 1][1];
console.log(lastOffset);
buses = buses.map(([id, diff]) => [id, lastOffset - diff] as const);
buses.sort(([a], [b]) => b - a);
console.log(buses);

// based on the C++ implementation from https://rosettacode.org/wiki/Chinese_remainder_theorem
function mulInv(a: number, b: number) {
    let b0 = b;
    let x0 = 0;
    let x1 = 1;

    if (b === 1) {
        return 1;
    }

    while (a > 1) {
        let q = Math.floor(a / b);
        let amb = a % b;
        a = b;
        b = amb;

        let xqx = x1 - q * x0;
        x1 = x0;
        x0 = xqx;
    }

    if (x1 < 0) {
        x1 += b0;
    }

    return x1;
}

function chineseRemainder(n: number[], a: number[]) {
    const prod = n.reduce((prev, current) => prev * current, 1);

    let sm = 0;
    for (let i = 0; i < n.length; i++) {
        let p = Math.floor(prod / n[i]);
        sm += a[i] * mulInv(p, n[i]) * p;
    }

    return sm % prod;
}
const f1 = buses.map(([a, b]) => a);
const f2 = buses.map(([a, b]) => b);
console.log(f1, f2);
let result = chineseRemainder(f1, f2) - lastOffset;
console.log(result);
