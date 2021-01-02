import { getContent, toString, fromString } from "./utils";

const tiles = getContent();

/**
 *  (-1, +1) nw  /\ ne (+1, +1) (change parity)
 *              /  \
 *      (-2) w |    | e (+2) (keep parity)
 *              \  /
 *   (-1, -1) sw \/ se (+1, -1) (change parity)
 */

const directionVectors = {
    w: [-2, 0],
    e: [2, 0],
    sw: [-1, -1],
    ne: [1, 1],
    nw: [-1, 1],
    se: [1, -1],
};

const directions = ["sw", "ne", "nw", "se", "w", "e"];

type Tile = [number, number];

const foundTiles: Set<string> = new Set();

function add(t1: Tile, t2: Tile) {
    return t1.map((val, idx) => val + t2[idx]) as Tile;
}

tiles.forEach((tileString) => {
    let currentTile: Tile = [0, 0];
    let suffix = tileString;
    while (suffix) {
        const key = directions.find((dir) => suffix.startsWith(dir));
        suffix = suffix.substring(key.length);
        currentTile = add(currentTile, directionVectors[key]);
    }
    const tileKey = toString(currentTile);
    if (foundTiles.has(tileKey)) {
        foundTiles.delete(tileKey);
    } else {
        foundTiles.add(tileKey);
    }
});

console.log(foundTiles.size);

let todayTiles = foundTiles;
let days = 100;
while (days--) {
    const processedTiles: Set<string> = new Set();
    const nextDayTiles: Set<string> = new Set();
    const exploreWhiteTile = (tile: Tile) => {
        // go around
        // count black ones
        // add or not add
        let countBlacks = 0;
        directions.forEach((key) => {
            const targetTile = add(tile, directionVectors[key]);
            if (todayTiles.has(toString(targetTile))) {
                countBlacks++;
            }
        });
        if (countBlacks === 2) {
            nextDayTiles.add(toString(tile));
        }
    };
    const exploreBlackTile = (tile: Tile) => {
        // go all directions
        // if got to white , unexplored , explore the white one
        // if got to black will get explored later, just count
        // add or not based on count
        let countBlacks = 0;
        directions.forEach((key) => {
            const targetTile = add(tile, directionVectors[key]);
            if (todayTiles.has(toString(targetTile))) {
                countBlacks++;
                return;
            }
            if (processedTiles.has(toString(targetTile))) {
                return;
            }
            processedTiles.add(toString(targetTile));
            exploreWhiteTile(targetTile);
        });
        if (countBlacks === 1 || countBlacks === 2) {
            nextDayTiles.add(toString(tile));
        }
    };

    todayTiles.forEach((tile) => {
        exploreBlackTile(fromString<Tile>(tile));
    });
    todayTiles = nextDayTiles;
    // console.log(todayTiles.size);
}
console.log(todayTiles.size);
