interface Chunkable<T> {
    length: number;
    slice: (start?: number, end?: number) => T;
}

export function chunk<T>(
    array: Chunkable<T>,
    chunkSize: number,
): T[] {
    const chunks: T[] = [];

    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }

    return chunks;
}

export function intersection<T>(a: T[], b: T[]): T[] {
    return a.filter((value: T) => b.includes(value));
}

export function clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

export function unique<T>(value: T, index: number, self: T[]) {
    return self.indexOf(value) === index;
}

export class Range {
    constructor(public start: number, public end: number) {}

    overlaps(range: Range) {
        return !(this.end < range.start || range.end < this.start);
    }

    contains(range: Range) {
        return this.start <= range.start && this.end >= range.end;
    }
}
