import { Range } from "../common/index.ts";

const INPUT_FILENAME = "input.txt";

const getSectionAssignments = async (
    filename: string,
) => {
    return (await Deno.readTextFile(filename))
        .split("\n")
        .map((line) => {
            const [s1, e1, s2, e2] = line
                .split(/[,-]/)
                .map((a) => parseInt(a, 10));

            return [new Range(s1, e1), new Range(s2, e2)];
        });
};

const totalIntersectingPairs = (await getSectionAssignments(INPUT_FILENAME))
    .map(
        ([left, right]): number =>
            left.contains(right) || right.contains(left) ? 1 : 0,
    )
    .reduce((sum, a) => sum + a, 0);

console.log(totalIntersectingPairs);

const totalOverlappingPairs = (await getSectionAssignments(INPUT_FILENAME))
    .map(
        ([left, right]): number => left.overlaps(right) ? 1 : 0,
    )
    .reduce((sum, a) => sum + a, 0);

console.log(totalOverlappingPairs);
