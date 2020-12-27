import { getContent, ListElement, parseNumber, printList } from "./utils";

let content = getContent()[0].split("").map(parseNumber);
let lg = content.length;

// Part I
// function processStep(state: number[]) {
//     let val = state.shift();
//     const segment = state.splice(0, 3);
//     let nextVal = val,
//         idx = -1;
//     do {
//         nextVal = nextVal > 1 ? nextVal - 1 : lg;
//         idx = state.findIndex((val) => val === nextVal);
//     } while (idx === -1);
//     state.splice(idx + 1, 0, ...segment);
//     state.push(val);
//     return state;
// }

// let steps = 100;

// while (steps--) {
//     // keep processing pos on 0
//     processStep(content);
// }

// const doublContent = [...content, ...content];
// const onePos = doublContent.findIndex((val) => val === 1);
// console.log(doublContent.slice(onePos + 1, onePos + 9).join(""));

// Part II - implement a mapped circular list
const valueToObject = new Map<number, ListElement>();

const ONE_MIL = 1000000;
lg = ONE_MIL;
for (let i = 10; i <= ONE_MIL; ++i) {
    content.push(i);
}
let prevElem: ListElement = {
    value: content[0],
    next: null,
};
let firstElem = prevElem;
prevElem.next = prevElem;
valueToObject.set(prevElem.value, prevElem);

for (let i = 1; i < content.length; ++i) {
    const newElem = {
        value: content[i],
        next: prevElem,
    };
    prevElem.next = newElem;
    prevElem = newElem;
    valueToObject.set(newElem.value, newElem);
}
prevElem.next = firstElem;
let lastElem = prevElem;

function processStepList() {
    const { value } = firstElem;
    const segmentStart = firstElem.next;
    const segmentEnd = segmentStart.next.next;
    firstElem.next = segmentEnd.next;

    const removedValues = new Set();
    removedValues.add(segmentStart.value);
    removedValues.add(segmentStart.next.value);
    removedValues.add(segmentStart.next.next.value);

    let nextVal = value;
    while (1) {
        nextVal = nextVal > 1 ? nextVal - 1 : lg;
        if (!removedValues.has(nextVal)) {
            break;
        }
    }

    const pivot = valueToObject.get(nextVal);
    const afterPivot = pivot.next;
    pivot.next = segmentStart;
    segmentEnd.next = afterPivot;
    if (pivot === lastElem) {
        lastElem = segmentEnd;
    }
    firstElem = firstElem.next;
}

let steps = 10000000;
while (steps--) {
    processStepList();
}
const oneElem = valueToObject.get(1);
console.log(oneElem.next.value * oneElem.next.next.value);
