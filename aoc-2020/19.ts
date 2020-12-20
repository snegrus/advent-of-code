import { getContent, parseNumber, prettyPrint } from "./utils";

const content = getContent("\n\n");

const inputValues = content[1]
    .split("\n")
    .filter((line) => line != null && line.length > 0);
const mapValues = content[0]
    .split("\n")
    .filter((rule) => rule != null)
    .map((rule) => {
        const [ruleId, ruleValue] = rule.split(": ");
        if (ruleValue.startsWith('"')) {
            return [parseNumber(ruleId), ruleValue.replace(/\"/g, "")] as const;
        } else {
            const rules = ruleValue
                .split(" | ")
                .map((rule) => rule.split(" ").map(parseNumber));
            return [parseNumber(ruleId), rules] as const;
        }
    });
const rules: Map<number, number[][] | string> = new Map();
mapValues.forEach(([key, value]) => {
    rules.set(key, value);
});

interface TrieNode {
    endsHere: number;
    next: { [key: string]: TrieNode };
}
const root: TrieNode = {
    endsHere: 0,
    next: {},
};

// build trie
inputValues.forEach((input) => {
    let currentNode = root;
    input.split("").forEach((char, idx) => {
        if (currentNode.next[char] == null) {
            currentNode.next[char] = { endsHere: 0, next: {} };
        }
        currentNode = currentNode.next[char];
        if (idx == input.length - 1) {
            ++currentNode.endsHere;
        }
    });
});

// function exploreTree({ endsHere, next }: TrieNode, prefix: string) {
//     if (endsHere) {
//         console.log(prefix);
//     }
//     Object.keys(next).forEach((key) => exploreTree(next[key], prefix + key));
// }
// exploreTree(root, "");

let result = 0;

interface ExplorationState {
    from: ExplorationState; // state where we got here from
    config: number[]; // list of rules for this state
    position: number; // position from config where we work on
    node: TrieNode; // node in the Trie where we are
}

/**
 * if pos is < config.length then create possible states from that rule and add to queue
 *  - if the current rule can be expanded in 1+ diferent rules then create a new state for each of them, starting from position 0
 *  - if the current rule is a character check if we can move from the current node and add new state
 * if pos === config.length create new state from `from` state , update node and increase position
 *  - if from state is null then we finished a state, if any strings end here add that count and remove the number
 *
 * an optimization is possible so that when a string is found for the first time, remove it from the trie
 */

const queue: ExplorationState[] = [];
const initialConfig = rules.get(0);
if (typeof initialConfig !== "string") {
    queue.push({
        from: undefined,
        config: initialConfig[0],
        position: 0,
        node: root,
    });
}

function moveFromState({ from, config, position, node }: ExplorationState) {
    if (position === config.length) {
        if (from == null) {
            result += node.endsHere;
            node.endsHere = 0;
        } else {
            const newState = {
                ...from,
                node,
                position: from.position + 1,
            };
            queue.push(newState);
        }
    } else {
        const targetRule = rules.get(config[position]);
        if (typeof targetRule === "string") {
            if (node.next[targetRule] != null) {
                const newState = {
                    from,
                    config,
                    position: position + 1,
                    node: node.next[targetRule],
                };
                queue.push(newState);
            }
        } else {
            targetRule.forEach((newConfig) => {
                const newState = {
                    from: { from, config, position, node },
                    config: newConfig,
                    position: 0,
                    node,
                };
                queue.push(newState);
            });
        }
    }
}

while (queue.length > 0) {
    const from = queue.pop();
    moveFromState(from);
}

console.log(result);
