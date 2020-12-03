import * as fs from "fs";

export function getContent() {
    const content = fs.readFileSync("input.txt", "utf8");
    return content.split("\n").filter((line) => line.length > 0);
}
