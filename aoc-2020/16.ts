import { getContent, parseNumber } from "./utils";

const [restrictionsGroup, yourTicketGroup, nearbyTicketsGroup] = getContent(
    "\n\n"
);

function breakRange(range: string) {
    const [start, end] = range.split("-").map(parseNumber);
    return { start, end };
}

const restrictions = restrictionsGroup
    .split("\n")
    .map((line) => line.match(/([a-z ]+): ([0-9-]+) or ([0-9-]+)/).slice(1, 4))
    .map(([category, range1, range2]) => {
        return {
            category,
            range1: breakRange(range1),
            range2: breakRange(range2),
        };
    });
// console.log(restrictions);

const yourTicket = yourTicketGroup
    .split("\n")
    .slice(1)[0]
    .split(",")
    .map(parseNumber);
// console.log(yourTicket);

const nearbyTickets = nearbyTicketsGroup
    .split("\n")
    .slice(1)
    .filter((line) => line.length !== 0)
    .map((line) => line.split(",").map(parseNumber));
// console.log(nearbyTickets);

// Part I
// let result = 0;
// nearbyTickets.forEach((ticket) => {
//     ticket.forEach((val) => {
//         let itFits = false;
//         restrictions.forEach(({ range1, range2 }) => {
//             if (itFits) {
//                 return;
//             }
//             if (range1.start <= val && val <= range1.end) {
//                 itFits = true;
//             }
//             if (range2.start <= val && val <= range2.end) {
//                 itFits = true;
//             }
//         });
//         if (!itFits) {
//             result += val;
//         }
//     });
// });
// console.log(result);

// Part II
const goodTickets = nearbyTickets.filter((ticket) => {
    return ticket.every((val) => {
        return restrictions.some(({ range1, range2 }) => {
            if (range1.start <= val && val <= range1.end) {
                return true;
            }
            if (range2.start <= val && val <= range2.end) {
                return true;
            }
            return false;
        });
    });
});

let candidates: number[][] = [];
for (let col = 0; col < restrictions.length; col++) {
    restrictions.forEach(({ range1, range2 }, idx) => {
        const allFit = goodTickets.every((ticket) => {
            const val = ticket[col];
            return (
                (range1.start <= val && val <= range1.end) ||
                (range2.start <= val && val <= range2.end)
            );
        });
        if (allFit) {
            if (candidates[col] == null) {
                candidates[col] = [];
            }
            candidates[col].push(idx);
        }
    });
}
// console.log(candidates);
const toRemove = new Set<number>();
const fixedPositions = new Set<number>();

while (fixedPositions.size != candidates.length) {
    const idx = candidates.findIndex(
        (positions, idx) => !fixedPositions.has(idx) && positions.length === 1
    );
    const val = candidates[idx][0];
    fixedPositions.add(idx);
    toRemove.add(val);
    candidates = candidates.map((vals, idx) => {
        if (!fixedPositions.has(idx)) {
            return vals.filter((val) => !toRemove.has(val));
        }
        return vals;
    });
}
// console.log(candidates);

let result = 1;
candidates.forEach(([pos], idx) => {
    if (restrictions[pos].category.startsWith("departure")) {
        result *= yourTicket[idx];
    }
});
console.log(result);
