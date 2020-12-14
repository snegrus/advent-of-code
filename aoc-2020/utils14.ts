import { parseNumber, NUMBER_RGX } from "./utils";

export function getMaskFromString(line: string) {
    return line
        .split(" = ")[1]
        .split("")
        .map((char) => {
            if (char === "X") {
                return char;
            } else {
                return parseNumber(char);
            }
        });
}

export function getAssignmentFromString(line: string) {
    const [all, pos, val] = line.match(
        `mem\\[(${NUMBER_RGX})\\] = (${NUMBER_RGX})`
    );
    return [parseNumber(pos), parseNumber(val)] as const;
}

export function getNumberAsMask(val: number) {
    const valMask = [];
    let lg = 36;
    while (lg--) {
        valMask.unshift(val % 2);
        val = Math.floor(val / 2);
    }
    return valMask;
}

export function applyMaskToNumber(
    mask: Array<string | number>,
    number: number[]
) {
    const result = [];
    number.forEach((val, idx) => {
        result[idx] = mask[idx] === "X" ? val : mask[idx];
    });
    return result;
}

export function getNumberFromMask(mask: number[]) {
    let result = 0;
    mask.forEach((val) => {
        result = result * 2 + val;
    });
    return result;
}

export function* generateMasks(mask: (number | "X")[], numberMask: number[]) {
    const processedMask = [];
    let cntX = 0;
    mask.forEach((val, idx) => {
        if (val === "X") {
            processedMask[idx] = "X";
            ++cntX;
        } else if (val === 1) {
            processedMask[idx] = 1;
        } else {
            processedMask[idx] = numberMask[idx];
        }
    });
    let variant = Math.pow(2, cntX) - 1;
    while (variant >= 0) {
        let config = variant;
        const instant = processedMask.map((char) => {
            if (char === "X") {
                const res = config % 2;
                config = Math.floor(config / 2);
                return res;
            }
            return char;
        });
        // console.log(instant.map((val) => val.toString()).join(""));
        --variant;
        yield getNumberFromMask(instant);
    }

    // console.log(processedMask.map((val) => val.toString()).join(""));
    // const result: number = 0;
    // yield result;
}
