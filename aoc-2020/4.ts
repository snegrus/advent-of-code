import { getContent, parseNumber } from "./utils";

const groups = getContent("\n\n");
// console.log(groups);

const requiredKeys = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
const optionalKey = "cid";

let validPassports = 0;
// Part I
// function processGroup(group: string) {
//     const pairs = group.split(/[ \n]/);
//     const found = {};
//     pairs.forEach((pair) => {
//         const [key, value] = pair.split(":");
//         found[key] = value;
//     });
//     let isValid = true;
//     requiredKeys.forEach((key) => {
//         if (found[key] == null) {
//             isValid = false;
//         }
//     });
//     if (isValid) {
//         validPassports++;
//     }
// }

// groups.forEach((group) => {
//     processGroup(group);
// });

const validationMap = {
    byr: (val: string) =>
        val.match(/[0-9]{4}/) &&
        parseNumber(val) >= 1920 &&
        parseNumber(val) <= 2002,
    iyr: (val: string) =>
        val.match(/[0-9]{4}/) &&
        parseNumber(val) >= 2010 &&
        parseNumber(val) <= 2020,
    eyr: (val: string) =>
        val.match(/[0-9]{4}/) &&
        parseNumber(val) >= 2020 &&
        parseNumber(val) <= 2030,
    hgt: (val: string) => {
        if (val.match(/^[0-9]{3}cm$/)) {
            const number = val.replace(/[a-z]+/g, "");
            return parseNumber(number) >= 150 && parseNumber(number) <= 193;
        }
        if (val.match(/^[0-9]{2}in$/)) {
            const number = val.replace(/[a-z]/g, "");
            return parseNumber(number) >= 59 && parseNumber(number) <= 76;
        }
    },
    hcl: (val: string) => val.match(/^[#][0-9a-f]{6}$/),
    ecl: (val: string) =>
        ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(val),
    pid: (val: string) => val.match(/^[0-9]{9,9}$/),
};

function processGroup(group: string) {
    const pairs = group.split(/[ \n]/);
    const found = {};
    let isValid = true;
    pairs.forEach((pair) => {
        const [key, value] = pair.split(":");
        found[key] = value;
        isValid =
            isValid &&
            (validationMap[key] == null || validationMap[key](value));
    });
    requiredKeys.forEach((key) => {
        if (found[key] == null) {
            isValid = false;
        }
    });
    if (isValid) {
        validPassports++;
    }
}

groups.forEach((group) => {
    processGroup(group);
});

console.log(validPassports);
