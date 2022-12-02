import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

const INPUT_FILENAME = "input.txt";

const caloriesByElf: number[] = [];

let currentElfCalories = 0;
const inputFile = await Deno.open(INPUT_FILENAME);

for await (const line of readLines(inputFile)) {
    if (line === "") {
        caloriesByElf.push(currentElfCalories);
        currentElfCalories = 0;
    } else {
        currentElfCalories += parseInt(line);
    }
}

inputFile.close();

caloriesByElf.push(currentElfCalories);

caloriesByElf.sort((a, b) => b - a);

console.log(`Most calories by a single Elf: ${caloriesByElf[0]}`);
console.log(
    `Total calories by top three Elves: ${
        caloriesByElf.slice(0, 3).reduce((sum, a) => sum + a, 0)
    }`,
);
