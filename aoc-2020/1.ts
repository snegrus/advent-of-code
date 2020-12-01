import * as fs from "fs";

const content = fs.readFileSync('input.txt', 'utf8');
const numbers: Array<number> = content.split("\n").filter(value => value.length > 0).map(value => Number.parseInt(value, 10));

// part I
// const foundValues = new Set<number>();
// let idx = 0; 
// for (; idx < numbers.length; idx++) {
// 	const value = numbers[idx];
// 	const other = 2020 - value;
// 	if (foundValues.has(other)) {
// 		console.log(value * other);
// 		break;
// 	}

// 	foundValues.add(value);
// }

// part II
const foundValues = new Set<number>();
let idx1 = 0;
for (; idx1 < numbers.length; idx1++) {
	const value1 = numbers[idx1];
	for (let idx2 = idx1 + 1; idx2 < numbers.length; idx2++) {
		const value2 = numbers[idx2];
		if (value1 + value2 > 2020) {
			continue;
		}
		const other = 2020 - value1 - value2;
		if (foundValues.has(other)) {
			console.log(value1 * value2 * other);
			break;
		}
	}
	foundValues.add(value1);
}
