function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    let arrElements = [];
    if (/\s/.test(expr)) {
        arrElements = expr.split(/\s+/);
    } else {
        arrElements = expr.split('');
    }
    let output = [];
    let operatorStack = [];
    let precedence = {
        '+': 2,
        '-': 2,
        '*': 3,
        '/': 3
    };
    // Shunting-yard algorithm
    arrElements.map(el => {
        // If element is Number:
        if (/\d+/gi.test(el)) {
            output.push(el);
            // If element is Operator:
        } else if (/[\-+*/]/gi.test(el)) {
            while (
                precedence[operatorStack[operatorStack.length - 1]] >= precedence[el] &&
                operatorStack[operatorStack.length - 1] !== '('
            ) {
                output.push(operatorStack.pop());
            }
            operatorStack.push(el);
            // If element is Parenthesis:
        } else if (el === '(') {
            operatorStack.push(el);
        } else if (el === ')') {
            while (operatorStack[operatorStack.length - 1] !== '(') {
                output.push(operatorStack.pop());
            }
            if (operatorStack[operatorStack.length - 1] === '(') {
                operatorStack.pop();
            }
        }
    });
    while (operatorStack.length !== 0) {
        output.push(operatorStack.pop());
    }

    //Calculating:

    function changeNums(num) {
        result.pop();
        result.pop();
        result.push(num);
    }
    let result = [];
    let divisionByZero = output.some(el => {
        let calculatedNum;
        if (/\d+/gi.test(el)) {
            result.push(el);
        }
        switch (el) {
            case '*':
                calculatedNum = result[result.length - 2] * result[result.length - 1];
                changeNums(calculatedNum);
                break;
            case '/':
                if (result[result.length - 1] == 0) {
                    return 1;
                }
                calculatedNum = result[result.length - 2] / result[result.length - 1];
                changeNums(calculatedNum);
                break;
            case '-':
                calculatedNum = result[result.length - 2] - result[result.length - 1];
                changeNums(calculatedNum);
                break;
            case '+':
                calculatedNum =
                    parseFloat(result[result.length - 2]) +
                    parseFloat(result[result.length - 1]);
                changeNums(calculatedNum);
                break;
        }
    });

    if (isNaN(result[0])) {
        throw 'ExpressionError: Brackets must be paired';
    } else if (divisionByZero) {
        throw 'TypeError: Devision by zero.';
    } else {
        return result[0];
    }
}

// function expressionCalculator(expr) {
//     return calculate(preporation(expr));
// }

// const preporation = (expression) => {
//     if (/[^\(\)+\-*\/\d\s]/.test(expression)) throw new Error(`ExpressionError: There is wrong characters in the expression [${expression}]`);
//     expression = `(${expression.replace(/\s+/g, '')})`;
//     if (!checker(expression.replace(/[+\-*\/\d\s]/g, ''))) throw new Error(`ExpressionError: Brackets must be paired`);
//     return expression;
// }

// function calculate(expression) {
//     if (/^\-?[\d\.]+(?:e[\-\+]\d*)?$/.test(expression)) {
//         return +expression;
//     } else {
//         const { groups: { unit } } = /(?<unit>\([\s\*\-\+\.\/\d]+\))/.exec(expression);
//         const result = calc(unit.replace(/[\(\)]/g, ''));
//         return calculate(expression.replace(unit, +result));
//     }
// }

// const finder = (expr, type) => {
//     let regex = new RegExp(`(?:(?:[\\d\\.]\\-)?)(?<found>\\-?[\\d\\.]+(?:e[\\-\\+]\\d*)?\\${type}\\-?[\\d\\.]+(?:e[\\-\\+]\\d*)?)`);
//     const result = regex.exec(expr);
//     return result ? result.groups.found : undefined;
// }

// const calc = (expression, type = 0) => {
//     const types = ['/', '*', '-', '+'];
//     let result = finder(expression, types[type]);
//     if (result) {
//         const regex = new RegExp(`(?:(?:[\\d\\.]+\\-)?)(?<first>\\-?[\\d\\.]+(?:e[\\-\\+]\\d*)?)\\${types[type]}(?<second>\\-?[\\d\\.]+(?:e[\\-\\+]\\d*)?)`);
//         let { groups: { first, second } } = regex.exec(result);//
//         if (type === 0 && second == 0) throw new Error(`TypeError: Devision by zero.`);
//         expression = expression.replace(result, sss(Number.parseFloat(first), Number.parseFloat(second), types[type]));
//         return calc(expression.replace(/\-{2}/g, '+'), type)
//     } else {
//         return type === 3 ? expression : calc(expression, ++type);
//     }
// }

// const sss = (a, b, type) => {
//     if (type === '/') { return a / b; }
//     if (type === '*') { return a * b; }
//     if (type === '-') { return a - b; }
//     if (type === '+') { return a + b; }
// }

// function checker(str, marker = false) {
//     const found = /\(\)/gm.exec(str);
//     marker = found === null ? false : true;

//     if (marker) {
//         let array = found.input.split('');
//         array.splice(found.index, found[0].length);
//         str = array.join('');
//         return str.length > 0 ? checker(str, marker) : marker;
//     } else {
//         return marker;
//     }
// }

module.exports = {
    expressionCalculator
}

