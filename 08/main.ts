import { rotate } from "../common/index.ts";

const INPUT_FILENAME = "input.txt";

const grid = (await Deno.readTextFile(INPUT_FILENAME))
    .split("\n")
    .map((line) => line.split("").map((height) => parseInt(height, 10)));

const gridRotated = rotate(grid);
const scenicScores = [];
let visibleTrees = 0;

for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
        const current = grid[y][x];
        const directions = [
            grid[y].slice(0, x).reverse(),
            grid[y].slice(x + 1),
            gridRotated[x].slice(0, y).reverse(),
            gridRotated[x].slice(y + 1),
        ];

        // Check if visible
        const smallestPeak = Math.min(
            ...directions.map((heights) => Math.max(...heights)),
        );

        if (current > smallestPeak) {
            visibleTrees++;
        }

        // Calculate scenic score
        let scenicScore = 1;
        directions.forEach((trees) => {
            const blockingTreeIndex = trees.findIndex((height) =>
                height >= current
            );

            scenicScore *= blockingTreeIndex < 0
                ? trees.length
                : blockingTreeIndex + 1;
        });
        scenicScores.push(scenicScore);
    }
}

console.log(`Visible trees: ${visibleTrees}`);
console.log(`Highest scenic score: ${Math.max(...scenicScores)}`);
