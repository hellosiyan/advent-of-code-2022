const INPUT_FILENAME = "input.txt";

const CHAR_a = "a".charCodeAt(0);
const CHAR_A = "A".charCodeAt(0);

type Rucksack = string[];

const intersection = <T>(a: T[], b: T[]) =>
    a.filter((value: T) => b.includes(value));

const getRucksacks = async (
    filename: string,
): Promise<Rucksack[]> => {
    return (await Deno.readTextFile(filename))
        .split("\n")
        .map((line) => line.split(""));
};

const splitIntoCompartments = (rucksack: Rucksack) => {
    return [
        rucksack.slice(0, rucksack.length / 2),
        rucksack.slice(rucksack.length / 2),
    ];
};

const findCommonItemTypeInCompartments = ([left, right]: string[][]) => {
    return intersection(left, right)[0];
};

const getItemTypePriority = (itemType: string) => {
    const charCode = itemType.charCodeAt(0);
    return charCode >= CHAR_a ? charCode - CHAR_a + 1 : charCode - CHAR_A + 27;
};

const groupRucksacks = (rucksacks: Rucksack[]) => {
    const groupSize = 3;
    const rucksackGroups = [];

    for (let i = 0; i < rucksacks.length; i += groupSize) {
        const group = rucksacks.slice(i, i + groupSize);
        rucksackGroups.push(group);
    }

    return rucksackGroups;
};

const findCommonItemTypeInRucksacks = ([first, second, third]: Rucksack[]) => {
    const intersection1 = intersection(first, second);
    const intersection2 = intersection(second, third);
    return intersection(intersection1, intersection2)[0];
};

const sumMisplacedItemsPriority = (await getRucksacks(INPUT_FILENAME))
    .map(splitIntoCompartments)
    .map(findCommonItemTypeInCompartments)
    .map(getItemTypePriority)
    .reduce((sum, a) => sum + a, 0);

console.log(
    `Sum of the misplaced item types' priorities: ${sumMisplacedItemsPriority}`,
);

const sumBadgePriority = groupRucksacks(await getRucksacks(INPUT_FILENAME))
    .map(findCommonItemTypeInRucksacks)
    .map(getItemTypePriority)
    .reduce((sum, a) => sum + a, 0);

console.log(`Sum of the badge item types' priorities: ${sumBadgePriority}`);
