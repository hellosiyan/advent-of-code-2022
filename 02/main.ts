const INPUT_FILENAME = "input.txt";

type HandShape = "rock" | "paper" | "scissors";
type Outcome = "lose" | "draw" | "win";

const HAND_SHAPES: {
    [Property in HandShape]: {
        score: number;
        defeats: HandShape;
        losesTo: HandShape;
    };
} = {
    rock: {
        score: 1,
        defeats: "scissors",
        losesTo: "paper",
    },
    paper: {
        score: 2,
        defeats: "rock",
        losesTo: "scissors",
    },
    scissors: {
        score: 3,
        defeats: "paper",
        losesTo: "rock",
    },
};

const KEYS_SHAPE: { [symbol: string]: HandShape } = {
    "A": "rock",
    "B": "paper",
    "C": "scissors",
    "X": "rock",
    "Y": "paper",
    "Z": "scissors",
};

const KEYS_OUTCOME: { [symbol: string]: Outcome } = {
    "X": "lose",
    "Y": "draw",
    "Z": "win",
};

const getRounds = async (
    filename: string,
): Promise<{ left: string; right: string }[]> => {
    return (await Deno.readTextFile(filename))
        .split("\n")
        .map((line) => {
            const [left, right] = line.split(" ");
            return { left, right };
        });
};

const scoreRound = (opponentHand: HandShape, myHand: HandShape) => {
    const shapeScore = HAND_SHAPES[myHand].score;
    let outcomeScore;

    switch (myHand) {
        case HAND_SHAPES[opponentHand].defeats:
            outcomeScore = 0;
            break;
        case opponentHand:
            outcomeScore = 3;
            break;
        default:
            outcomeScore = 6;
    }

    return shapeScore + outcomeScore;
};

const chooseHandShapeForOutcome = (
    opponentHand: HandShape,
    outcome: Outcome,
): HandShape => {
    if (outcome === "draw") {
        return opponentHand;
    } else if (outcome === "lose") {
        return HAND_SHAPES[opponentHand].defeats;
    } else {
        return HAND_SHAPES[opponentHand].losesTo;
    }
};

const step1TotalScore = (await getRounds(INPUT_FILENAME))
    .map((round) => ({
        opponentHand: KEYS_SHAPE[round.left],
        myHand: KEYS_SHAPE[round.right],
    }))
    .map(({ opponentHand, myHand }) => scoreRound(opponentHand, myHand))
    .reduce((sum, a) => sum + a, 0);

console.log(`Total score (step 1): ${step1TotalScore}`);

const step2TotalScore = (await getRounds(INPUT_FILENAME))
    .map((round) => ({
        opponentHand: KEYS_SHAPE[round.left],
        outcome: KEYS_OUTCOME[round.right],
    }))
    .map((round) => ({
        opponentHand: round.opponentHand,
        myHand: chooseHandShapeForOutcome(round.opponentHand, round.outcome),
    }))
    .map(({ opponentHand, myHand }) => scoreRound(opponentHand, myHand))
    .reduce((sum, a) => sum + a, 0);

console.log(`Total score (step 2): ${step2TotalScore}`);
