import { clone } from "../common/index.ts";

const INPUT_FILENAME = "input.txt";

type Monkey = {
    items: number[];
    op: {
        sign: "+" | "*";
        value: number | "old";
    };
    divisor: number;
    ifTrue: number;
    ifFalse: number;
    inspected: number;
};

const OPS = {
    "+": (a: number, b: number) => a + b,
    "*": (a: number, b: number) => a * b,
};

const monkeys: Monkey[] = [];

(await Deno.readTextFile(INPUT_FILENAME))
    .split("\n")
    .forEach((line) => {
        const monkey = monkeys[monkeys.length - 1];

        if (line.startsWith("Monkey")) {
            monkeys.push({
                items: [],
                op: { sign: "*", value: 1 },
                divisor: 1,
                ifTrue: 0,
                ifFalse: 0,
                inspected: 0,
            });
        } else if (line.startsWith("  Starting items: ")) {
            monkey.items = line.slice(18)
                .split(", ")
                .map((item) => parseInt(item, 10));
        } else if (line.startsWith("  Operation: new = old ")) {
            monkey.op.sign = line.slice(23, 24) === "*" ? "*" : "+";
            monkey.op.value = line.slice(25) === "old"
                ? "old"
                : parseInt(line.slice(24), 10);
        } else if (line.startsWith("  Test: divisible by ")) {
            monkey.divisor = parseInt(line.slice(21), 10);
        } else if (line.startsWith("    If true: throw to monkey ")) {
            monkey.ifTrue = parseInt(line.slice(29), 10);
        } else if (line.startsWith("    If false: throw to monkey ")) {
            monkey.ifFalse = parseInt(line.slice(30), 10);
        }
    });

function sendToPLay(
    monkeys: Monkey[],
    rounds: number,
    onBreak: (worry: number) => number,
) {
    for (let index = 0; index < rounds; index++) {
        monkeys.forEach((monkey) => {
            monkey.items.forEach((item) => {
                monkey.inspected++;

                const value = monkey.op.value === "old"
                    ? item
                    : monkey.op.value;

                let worry = OPS[monkey.op.sign](item, value);

                worry = onBreak(worry);

                const target = (worry % monkey.divisor === 0)
                    ? monkey.ifTrue
                    : monkey.ifFalse;

                monkeys[target].items.push(worry);
            });

            monkey.items = [];
        });
    }

    return monkeys;
}

const partOne = sendToPLay(clone(monkeys), 20, (worry) => Math.floor(worry / 3))
    .map((monkey) => monkey.inspected)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((res, a) => res * a, 1);

const commonDen = monkeys.reduce((res, a) => res * a.divisor, 1);
const partTwo = sendToPLay(clone(monkeys), 10000, (worry) => worry % commonDen)
    .map((monkey) => monkey.inspected)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((res, a) => res * a, 1);

console.log(`Total monkey business (part 1): ${partOne}`);
console.log(`Total monkey business (part 2): ${partTwo}`);
