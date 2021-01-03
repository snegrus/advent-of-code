import { exit } from "process";
import { getContent, parseNumber } from "./utils";

const [cardPk, doorPk] = getContent().map(parseNumber);

const subjNumber = 7;
const MOD_VALUE = 20201227;

function getLoopSize(targetValue: number) {
    let step = 0;
    let currentValue = 1;
    while (currentValue !== targetValue) {
        currentValue = (currentValue * subjNumber) % MOD_VALUE;
        ++step;
    }
    return step;
}

function getKey(value: number, stepCnt: number) {
    let key = 1;
    while (stepCnt--) {
        key = (key * value) % MOD_VALUE;
    }
    return key;
}

const cardLoopSize = getLoopSize(cardPk);
const doorLoopSize = getLoopSize(doorPk);

console.log(getKey(doorPk, cardLoopSize));
console.log(getKey(cardPk, doorLoopSize));
