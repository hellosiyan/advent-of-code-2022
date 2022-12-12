const INPUT_FILENAME = "input.txt";

type Coordinate = [number, number];

const lowestElevation = "a".charCodeAt(0);
const highestElevation = "z".charCodeAt(0);

const startMarker = "S".charCodeAt(0);
const endMarker = "E".charCodeAt(0);

let start: Coordinate = [0, 0];
let goal: Coordinate = [0, 0];

const map = (await Deno.readTextFile(INPUT_FILENAME))
    .split("\n")
    .map((line) => line.split("").map((char) => char.charCodeAt(0)));

map.forEach((row, index) => {
    if (row.includes(startMarker)) {
        start = [index, row.indexOf(startMarker)];
    }

    if (row.includes(endMarker)) {
        goal = [index, row.indexOf(endMarker)];
    }
});

map[start[0]][start[1]] = lowestElevation;
map[goal[0]][goal[1]] = highestElevation;

const DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

const findPath = (
    map: number[][],
    start: Coordinate,
    isEligible: (
        target: Coordinate,
        location: Coordinate,
    ) => boolean,
    isGoal: (location: Coordinate) => boolean,
) => {
    const visited: string[] = [];
    let paths: Coordinate[][] = [[start]];

    while (paths.length > 0) {
        const newPaths: Coordinate[][] = [];

        for (const path of paths) {
            const current = path[path.length - 1];

            for (const direction of DIRECTIONS) {
                const target: Coordinate = [
                    current[0] + direction[0],
                    current[1] + direction[1],
                ];

                if (
                    map[target[0]] === undefined ||
                    map[target[0]][target[1]] === undefined ||
                    visited.includes(target.join(","))
                ) {
                    continue;
                }

                if (!isEligible(target, current)) {
                    continue;
                }

                if (isGoal(target)) {
                    return path.length;
                }

                visited.push(target.join(","));
                newPaths.push([...path, target]);
            }
        }

        paths = newPaths;
    }
};

const part1 = findPath(
    map,
    start,
    (t, l) => map[t[0]][t[1]] - map[l[0]][l[1]] <= 1,
    (location) => location.join(",") === goal.join(","),
);

const part2 = findPath(
    map,
    goal,
    (t, l) => map[t[0]][t[1]] - map[l[0]][l[1]] >= -1,
    (location) => map[location[0]][location[1]] == lowestElevation,
);

console.log(`Steps on shortest path: ${part1}`);
console.log(`Steps on shortest path from any low point: ${part2}`);
