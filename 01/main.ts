import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

const INPUT_FILENAME = "input.txt";

const calories: number[] = [];

let currentElfCalories = 0;
const inputFile = await Deno.open(INPUT_FILENAME);

for await (const line of readLines(inputFile)) {
    if (line === "") {
        calories.push(currentElfCalories);
        currentElfCalories = 0;
    } else {
        currentElfCalories += parseInt(line);
    }
}

inputFile.close();

calories.push(currentElfCalories);

const maxCaloriesBySingleElf = Math.max.apply(null, calories);

console.log(`Most calories by a single elf: ${maxCaloriesBySingleElf}`);
