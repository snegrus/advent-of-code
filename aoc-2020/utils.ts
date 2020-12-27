import * as fs from "fs";

export function getContent(separator: string = "\n") {
    const content = fs.readFileSync("input.txt", "utf8");
    return content.split(separator).filter((line) => line.length > 0);
}

export function parseNumber(number: string) {
    return Number.parseInt(number, 10);
}

export function prettyPrint(obj: Object) {
    console.log(JSON.stringify(obj, null, 4));
}

export function getSetIntersection<T>(a: Set<T>, b: Set<T>) {
    const result = new Set<T>();
    [...a].forEach((value) => {
        if (b.has(value)) {
            result.add(value);
        }
    });
    return result;
}

export interface ListElement {
    next: ListElement;
    value: number;
}

export function printList(start: ListElement) {
    const result = [];
    result.push(start.value);
    for (let it = start.next; it != start; it = it.next) {
        result.push(it.value);
    }
    console.log(result);
}

export const NUMBER_RGX = "[0-9]+";
