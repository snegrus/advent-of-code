import { exists } from "fs";
import { exit } from "process";
import { getContent, parseNumber, prettyPrint } from "./utils";

function reverse(line: string) {
    return line.split("").reverse().join("");
}

type TileObject = {
    up: string;
    left: string;
    right: string;
    down: string;
    content: string[];
};

function rotateTile(tile: string[]) {
    const n = tile.length;
    const newTile: string[] = [];
    for (let i = 0; i < tile.length; i++) {
        newTile[i] = "";
        for (let j = 0; j < tile[i].length; ++j) {
            newTile[i] += tile[n - j - 1][i];
        }
    }
    return newTile;
}

function generateRotations(tile: string[]) {
    const variations: TileObject[] = [];
    const up = tile[0];
    const down = reverse(tile[tile.length - 1]);
    const left = reverse(tile.map((line) => line[0]).join(""));
    const right = tile.map((line) => line[line.length - 1]).join("");

    let rotated = tile;
    variations.push({ up, down, left, right, content: rotated });

    rotated = rotateTile(rotated);
    variations.push({
        up: left,
        right: up,
        down: right,
        left: down,
        content: rotated,
    });
    rotated = rotateTile(rotated);
    variations.push({
        up: down,
        right: left,
        down: up,
        left: right,
        content: rotated,
    });
    rotated = rotateTile(rotated);
    variations.push({
        up: right,
        right: down,
        down: left,
        left: up,
        content: rotated,
    });
    return variations;
}

function generateVariations(tile: string[]) {
    const variations: TileObject[] = [];

    variations.push(...generateRotations(tile));
    variations.push(...generateRotations(tile.map(reverse)));
    return variations;
}

const tiles = getContent("\n\n").map((tile) => {
    const lines = tile
        .split("\n")
        .filter((line) => line != null && line.length > 0);
    const id = parseNumber(lines[0].match(/Tile ([0-9]+):/)[1]);
    const content = lines.slice(1);
    const variations = generateVariations(content);

    variations.forEach((variation) => {
        if (
            variation.content[0] !== variation.up ||
            variation.down !== reverse(variation.content[9])
        ) {
            prettyPrint(variation);
            exit(0);
        }
    });

    return { id, variations };
});

const n = Math.sqrt(tiles.length);
const usedTiles = new Set();
const image: TileObject[][] = [];
const imageIds: number[][] = [];
for (let i = 0; i < n; ++i) {
    image[i] = [];
    imageIds[i] = [];
}

let notFound = true;
function tryTiles(x: number, y: number) {
    for (let i = 0; i < tiles.length && notFound; i++) {
        if (!usedTiles.has(i)) {
            imageIds[x][y] = tiles[i].id;
            usedTiles.add(i);
            for (let j = 0; j < tiles[i].variations.length && notFound; ++j) {
                image[x][y] = tiles[i].variations[j];

                if (y > 0) {
                    if (image[x][y - 1].right !== reverse(image[x][y].left)) {
                        continue;
                    }
                }
                if (x > 0) {
                    if (image[x - 1][y].down !== reverse(image[x][y].up)) {
                        continue;
                    }
                }

                if (y + 1 < n) {
                    tryTiles(x, y + 1);
                } else if (x + 1 < n) {
                    tryTiles(x + 1, 0);
                } else {
                    const result =
                        imageIds[0][0] *
                        imageIds[0][n - 1] *
                        imageIds[n - 1][0] *
                        imageIds[n - 1][n - 1];
                    notFound = false;
                    console.log(result);
                }
            }
            usedTiles.delete(i);
        }
    }
}

tryTiles(0, 0);

function showImageTiles(image: TileObject[][], lg: number) {
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < lg; ++j) {
            let line: string = "";
            for (let k = 0; k < n; ++k) {
                line += image[i][k].content[j] + " ";
            }
            console.log(line);
        }
        console.log();
    }
}

// showImageTiles(image, 10);

// remove borders

const borderLessTilesImage = image.map((line) =>
    line.map((tile) => {
        let content = tile.content
            .slice(1, 10)
            .map((line) => line.substr(1, 8));
        return { ...tile, content };
    })
);

// console.log("\n-----------------------------------\n");
// showImageTiles(borderLessTilesImage, 8);

function getFinalImage(image: TileObject[][]) {
    const result = [];
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < 8; ++j) {
            let line: string = "";
            for (let k = 0; k < n; ++k) {
                line += image[i][k].content[j];
            }
            result.push(line);
        }
    }
    return result;
}
const finalImage = getFinalImage(borderLessTilesImage);

const relativeLocations = [
    [0, 18],
    [1, 0],
    [1, 5],
    [1, 6],
    [1, 11],
    [1, 12],
    [1, 17],
    [1, 18],
    [1, 19],
    [2, 1],
    [2, 4],
    [2, 7],
    [2, 10],
    [2, 13],
    [2, 16],
];

generateVariations(finalImage)
    .map((image) => image.content)
    .map((tile) => tile.map((line) => line.split("")))
    .forEach((image) => {
        let result = 0;
        let found = false;
        for (let i = 0; i + 2 < image.length; ++i) {
            for (let j = 0; j + 19 < image[i].length; ++j) {
                if (
                    relativeLocations.every(([x, y]) => {
                        return image[i + x][j + y] === "#";
                    })
                ) {
                    found = true;
                    relativeLocations.forEach(([x, y]) => {
                        image[i + x][j + y] = "O";
                    });
                }
            }
        }
        image.forEach((line) => {
            line.forEach((col) => (result += col === "#" ? 1 : 0));
        });
        if (found) {
            console.log(result);
        }
    });

/**

#..#..#.## ####....#. ...#..###. 
..####.... .#####..#. ....###... 
.#####..## #..#.#.##. .##..#.#.# 
..#.#...## #.###...## #.##.##... 
##.#.##.#. .##.#.##.. .##.###### 
#..##.###. ..####..## #.####.##. 
....#.#... .##.##.... .#..#..##. 
##.##.#..# ##.#..#..# ###.#.#... 
..###.##.# #....#.... .###.#.... 
.#..#####. ......#..# #.#.##...# 

.#..#####. ......#..# #.#.##...# 
.#.####.#. ..#....### #.#..#.#.# 
###...#..# ##....#..# ##...####. 
#..#.##..# #.###..#.. .#####..## 
#....#.##. ..#.###### #....#.... 
...##.##.# ####.....# ##.##..#.# 
.#...#.... .###..###. .#....##.. 
#.#.##.... .#.##.#.## #.###...#. 
##.###.#.# #.####.... .##..#.... 
#..##.#... .#.#.###.. .#..#..... 

#..##.#... .#.#.###.. .#..#..... 
.#.###.... .#.##...## #.######.. 
#.###.#### #.######## #..#####.. 
...##.#... .#..#.###. .####.#### 
##.#..##.# #########. ...#..##.# 
##.#####.# #.#.#...#. .#..#..... 
##....##.# #.#.###### #####..##. 
##...#.... ...#..##.# #..###.##. 
##..###... ...##.#..# #.##.##.#. 
.#....#... .####....# ###....##. 


-----------------------------------

.####... #####..# ...###.. 
#####..# ..#.#.## ##..#.#. 
.#.#...# .###...# .##.##.. 
#.#.##.# ##.#.##. ##.##### 
..##.### .####..# .####.## 
...#.#.. ##.##... #..#..## 
#.##.#.. #.#..#.. ##.#.#.. 
.###.##. ....#... ###.#... 

#.####.# .#....## .#..#.#. 
##...#.. #....#.. #...#### 
..#.##.. .###..#. #####..# 
....#.## .#.##### ....#... 
..##.##. ###..... #.##..#. 
#...#... ###..### #....##. 
.#.##... #.##.#.# .###...# 
#.###.#. .####... ##..#... 

#.###... #.##...# .######. 
.###.### .####### ..#####. 
..##.#.. #..#.### ####.### 
#.#..##. ######## ..#..##. 
#.#####. .#.#...# #..#.... 
#....##. .#.##### ####..## 
#...#... ..#..##. ..###.## 
#..###.. ..##.#.. .##.##.# 


..................# 
#    ##    ##    ###
 #  #  #  #  #  #   

[0, 18]
[1, 0]
[1, 5]
[1, 6]
[1, 11]
[1, 12]
[1, 17]
[1, 18]
[1, 19]
[2, 1]
[2, 4]
[2, 7]
[2, 10]
[2, 13]
[2, 16]


 */
