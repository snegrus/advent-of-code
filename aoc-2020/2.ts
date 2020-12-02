import * as fs from "fs";

function parseBounds(bounds: string) {
	return bounds.split("-").map(value => Number.parseInt(value, 10));
}

const content = fs.readFileSync('input.txt', 'utf8');
const lines = content.split("\n").filter(line => line.length > 0);
let result = 0;

// part I
// lines.forEach(line => {
// 	const [range, letter, password] = line.split(" ");
// 	const [lowerBound, upperBound] = parseBounds(range);
// 	const character = letter[0];
// 	let count = 0;
// 	password.split("").forEach(char => count += char === character ? 1 : 0);
// 	if (lowerBound <= count && count <= upperBound) {
// 		++result;
// 	}
// });

// part II
lines.forEach(line => {
	const [range, letter, password] = line.split(" ");
	const [firstPos, secondPos] = parseBounds(range);
	const character = letter[0];
	if (secondPos > password.length) {
		console.error("position is outside");
	}
	if ((password[firstPos - 1] === character) !== (password[secondPos - 1] === character)) {
		++result;
	}
});

console.log(result);
