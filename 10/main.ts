const INPUT_FILENAME = "input.txt";

let cycle = 0;
let X = 1;
let signalStrengthSum = 0;

const encoder = new TextEncoder();
const display = (str: string) => Deno.stdout.writeSync(encoder.encode(str));

(await Deno.readTextFile(INPUT_FILENAME))
    .split("\n")
    .map((line) => line.split(" "))
    .map(([cmd, val]) => [
        cmd === "addx" ? 2 : 1,
        val ? parseInt(val, 10) : 0,
    ])
    .forEach(([cmdCycles, val]) => {
        for (let index = 0; index < cmdCycles; index++) {
            const crtPosition = cycle % 40;

            if (crtPosition === 0) display("\n");

            cycle++;

            display(Math.abs(crtPosition - X) < 2 ? "#" : ".");

            if ((cycle + 20) % 40 === 0) {
                signalStrengthSum += cycle * X;
            }
        }

        X += val;
    });

console.log(`\nSum of signal strengths: ${signalStrengthSum}`);
