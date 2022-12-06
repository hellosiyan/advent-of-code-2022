import { chunk, clone } from "../common/index.ts";

const INPUT_FILENAME = "input.txt";

type MoveProcedure = {
    total: number;
    from: number;
    to: number;
};

const readFile = async (filename: string) => {
    const [stacks, moves] = (await Deno.readTextFile(filename))
        .split("\n\n");

    return {
        stacks: readStacks(stacks),
        moves: readMoves(moves),
    };
};

function readStacks(stackTable: string) {
    const tableRows = stackTable.split("\n");

    // Remove bottom row of stack numbers
    tableRows.pop();

    // Read crate letters
    const crateRows = tableRows.map((tableRow) =>
        chunk(tableRow, 4).map((tableCell) => {
            return (tableCell.match(/(?<=\[)[A-Z](?=\])/) ?? [])[0];
        })
    );

    const stackCount = crateRows[0].length;
    const stacks: string[][] = Array.from(Array(stackCount), () => []);

    // Construct stacks
    crateRows.forEach((crateRow) => {
        crateRow.forEach((crate, column) => {
            if (crate) {
                stacks[column].push(crate);
            }
        });
    });

    return stacks;
}

function readMoves(movesList: string): MoveProcedure[] {
    return movesList
        .split("\n")
        .map((line) => {
            const matches = line.match(/(\d+) from (\d+) to (\d+)/);

            if (!matches) throw new Error(`Cannot read move line "${line}"`);

            return {
                total: parseInt(matches[1], 10),
                from: parseInt(matches[2], 10),
                to: parseInt(matches[3], 10),
            };
        });
}

function crane(moves: MoveProcedure[], stacks: string[][], moveInBulk = false) {
    moves.forEach(({ total, from, to }) => {
        const pickedCrates = stacks[from - 1].splice(0, total);
        if (!moveInBulk) pickedCrates.reverse();
        stacks[to - 1] = [...pickedCrates, ...stacks[to - 1]];
    });
}

const { stacks, moves } = await readFile(INPUT_FILENAME);

((stacks) => {
    crane(moves, stacks);

    const topCrates = stacks.map((crates) => crates[0]).join("");

    console.log(`Top crates, part one: ${topCrates}`);
})(clone(stacks));

((stacks) => {
    crane(moves, stacks, true);

    const topCrates = stacks.map((crates) => crates[0]).join("");

    console.log(`Top crates, part two: ${topCrates}`);
})(clone(stacks));
