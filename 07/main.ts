const INPUT_FILENAME = "input.txt";

const cwd = ["/"];
const dirs: { [key: string]: number } = {
    "/": 0,
};

(await Deno.readTextFile(INPUT_FILENAME))
    .split("\n")
    .slice(1)
    .forEach(
        (line) => {
            if (line.substring(0, 4) == "$ cd") {
                const target = line.substring(5);

                if (target == "..") {
                    cwd.pop();
                } else {
                    const fullName = cwd[cwd.length - 1] + target + "/";

                    dirs[fullName] = 0;
                    cwd.push(fullName);
                }
            } else if (line[0] !== "$") {
                const { groups } = line.match(/^(?<size>\d+)/) ?? {};

                if (groups?.size) {
                    cwd.forEach((dir) =>
                        dirs[dir] += parseInt(groups.size, 10)
                    );
                }
            }
        },
    );

const smallDirsSizeSum = Object.values(dirs)
    .reduce(
        (sum, a) => a <= 100000 ? sum + a : sum,
        0,
    );

console.log(
    `Sum of the total sizes of all small directories: ${smallDirsSizeSum}`,
);

const spaceNeeded = 30000000 - (70000000 - dirs["/"]);

const smallestSufficientDirSize = Object.values(dirs)
    .filter((size) => size >= spaceNeeded)
    .sort((a, b) => a - b)[0];

console.log(
    `Size of the smallest, yet sufficiently big, directory: ${smallestSufficientDirSize}`,
);
