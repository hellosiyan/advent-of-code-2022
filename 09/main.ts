const INPUT_FILENAME = "input.txt";

const MOVES = {
    L: { x: -1, y: 0 },
    R: { x: 1, y: 0 },
    U: { x: 0, y: 1 },
    D: { x: 0, y: -1 },
};

const positionsK2 = new Set();
const positionsK10 = new Set();

const knots = Array.from(Array(10), () => ({ x: 0, y: 0 }));

(await Deno.readTextFile(INPUT_FILENAME))
    .split("\n")
    .map((line) => line.split(" "))
    .forEach((line) => {
        const move = MOVES[line[0] as keyof typeof MOVES];
        const steps = parseInt(line[1], 10);

        for (let step = 0; step < steps; step++) {
            knots[0].x += move.x;
            knots[0].y += move.y;

            for (let i = 1; i < knots.length; i++) {
                const tail = knots[i];
                const head = knots[i - 1];

                if (
                    Math.abs(head.x - tail.x) > 1 ||
                    Math.abs(head.y - tail.y) > 1
                ) {
                    tail.x += head.x - tail.x !== 0
                        ? (head.x > tail.x ? 1 : -1)
                        : 0;

                    tail.y += head.y - tail.y !== 0
                        ? (head.y > tail.y ? 1 : -1)
                        : 0;
                }
            }

            positionsK2.add(`${knots[1].x}|${knots[1].y}`);
            positionsK10.add(`${knots[9].x}|${knots[9].y}`);
        }
    });

console.log(`Total positions visited by the second knot: ${positionsK2.size}`);
console.log(`Total positions visited by the tenth knot: ${positionsK10.size}`);
