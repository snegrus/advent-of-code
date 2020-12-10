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
