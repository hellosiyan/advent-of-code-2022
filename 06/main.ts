import { unique } from "../common/index.ts";

const INPUT_FILENAME = "input.txt";

const markers: [string, number][] = [
    ["Start-of-packet", 4],
    ["Start-of-message", 14],
];

const signal = (await Deno.readTextFile(INPUT_FILENAME)).split("");

markers.map(([markerType, markerLength]) => {
    for (let index = markerLength; index < signal.length; index++) {
        const numUniqueChars = signal
            .slice(index - markerLength, index)
            .filter(unique)
            .length;

        if (numUniqueChars === markerLength) {
            console.log(`${markerType} at: ${index}`);
            break;
        }
    }
});
