import { getContent, parseNumber } from "./utils";

const lines = getContent();

// Part I
// function evaluateExpression(expression: string, pos: number) {
//     let result = 0;
//     let lastOp = null;
//     while (pos < expression.length && expression[pos] !== ")") {
//         if (expression[pos] === "(") {
//             let partialResult: number;
//             ++pos;
//             [partialResult, pos] = evaluateExpression(expression, pos);

//             switch (lastOp) {
//                 case null:
//                     result = partialResult;
//                     break;
//                 case "+":
//                     result += partialResult;
//                     break;
//                 case "*":
//                     result *= partialResult;
//                 default:
//                     break;
//             }
//         } else if ("*+".includes(expression[pos])) {
//             lastOp = expression[pos];
//             ++pos;
//         } else {
//             let term = "";
//             while (pos < expression.length && expression[pos].match(/[0-9]/)) {
//                 term += expression[pos];
//                 ++pos;
//             }
//             const partialResult = parseNumber(term);
//             switch (lastOp) {
//                 case null:
//                     result = partialResult;
//                     break;
//                 case "+":
//                     lastOp = null;
//                     result += partialResult;
//                     break;
//                 case "*":
//                     lastOp = null;
//                     result *= partialResult;
//                 default:
//                     break;
//             }
//         }
//     }
//     ++pos;
//     return [result, pos];
// }

// let finalResult = 0;
// lines.forEach((line) => {
//     const noSpaceLine = line
//         .split("")
//         .filter((char) => char !== " ")
//         .join("");
//     const result = evaluateExpression(noSpaceLine, 0);
//     finalResult += result[0];
//     console.log(result);
// });
// console.log(finalResult);

// Part II
type StackElement = [number, string] | [number];

function evaluateExpression(expression: string, pos: number) {
    const stack: Array<StackElement> = [];
    const getTopStack = (): StackElement => {
        return stack[stack.length - 1];
    };

    const processValue = (value: number) => {
        if (stack.length === 0) {
            stack.push([value]);
            return;
        }
        const [prevResult, lastOp] = getTopStack();
        switch (lastOp) {
            case "+":
                stack.pop();
                stack.push([prevResult + value]);
                break;
            default:
                stack.push([value]);
                break;
        }
    };

    while (pos < expression.length && expression[pos] !== ")") {
        if (expression[pos] === "(") {
            let partialResult: number;
            ++pos;
            [partialResult, pos] = evaluateExpression(expression, pos);
            processValue(partialResult);
        } else if ("*+".includes(expression[pos])) {
            const lastOp = expression[pos];
            const [prevVal] = getTopStack();
            stack.pop();
            stack.push([prevVal, lastOp]);
            ++pos;
        } else {
            let term = "";
            while (pos < expression.length && expression[pos].match(/[0-9]/)) {
                term += expression[pos];
                ++pos;
            }
            const partialResult = parseNumber(term);
            processValue(partialResult);
        }
    }
    ++pos;
    let result = 1;
    stack.forEach(([value]) => (result *= value));
    return [result, pos];
}

let finalResult = 0;
lines.forEach((line) => {
    const noSpaceLine = line
        .split("")
        .filter((char) => char !== " ")
        .join("");
    const [value] = evaluateExpression(noSpaceLine, 0);
    finalResult += value;
});
console.log(finalResult);
