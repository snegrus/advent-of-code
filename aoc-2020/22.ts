import { getContent, parseNumber } from "./utils";

const content = getContent("\n\n");
const player1 = content[0]
    .split("\n")
    .filter((line) => line != null && line.length > 0)
    .slice(1)
    .map(parseNumber);
const player2 = content[1]
    .split("\n")
    .filter((line) => line != null && line.length > 0)
    .slice(1)
    .map(parseNumber);

// Part I
// while (player1.length && player2.length) {
//     const card1 = player1.shift();
//     const card2 = player2.shift();
//     if (card1 > card2) {
//         player1.push(card1, card2);
//     } else {
//         player2.push(card2, card1);
//     }
// }

function getResult(player: number[]) {
    let factor = player.length;
    let result = 0;
    player.forEach((card) => {
        result += factor * card;
        --factor;
    });
    return result;
}

// console.log(getResult(player1.length > player2.length ? player1 : player2));

// Part II

function codifyState(player1: number[], player2: number[]) {
    return `${player1.join(",")}-${player2.join(",")}`;
}

function playRecursiveCombat(player1: number[], player2: number[]) {
    const prevStates = new Set();
    while (player1.length && player2.length) {
        const currentState = codifyState(player1, player2);
        if (prevStates.has(currentState)) {
            return { winner: 1, finalState: [] };
        }
        prevStates.add(currentState);

        const card1 = player1.shift();
        const card2 = player2.shift();
        if (card1 <= player1.length && card2 <= player2.length) {
            // play recursive;
            const subGameResult = playRecursiveCombat(
                player1.slice(0, card1),
                player2.slice(0, card2)
            );
            const winner = subGameResult.winner;
            if (winner === 1) {
                player1.push(card1, card2);
            } else {
                player2.push(card2, card1);
            }
        } else {
            if (card1 > card2) {
                player1.push(card1, card2);
            } else {
                player2.push(card2, card1);
            }
        }
    }
    if (player1.length) {
        // prevGames.set(currentGame, 1);
        return { winner: 1, finalState: player1 };
    } else {
        // prevGames.set(currentGame, 2);
        return { winner: 2, finalState: player2 };
    }
}

console.log("final result");
console.log(getResult(playRecursiveCombat(player1, player2).finalState));
