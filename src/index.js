function eval() {
    // Do not use eval!!!
    return;
}



function expressionCalculator(expr) {
    return calculate(preporation(expr));
}

const preporation = (expression) => {
    if (/[^\(\)+\-*\/\d\s]/.test(expression)) throw new Error(`ExpressionError: There is wrong characters in the expression [${expression}]`);
    expression = `(${expression.replace(/\s+/g, '')})`;
    if (!checker(expression.replace(/[+\-*\/\d\s]/g, ''))) throw new Error(`ExpressionError: Brackets must be paired`);
    return expression;
}

function calculate(expression) {
    if (/^\-?[\d\.]+(?:e[\-\+]\d*)?$/.test(expression)) {
        return +expression;
    } else {
        const { groups: { unit } } = /(?<unit>\([\s\*\-\+\.\/\d]+\))/.exec(expression);
        const result = calc(unit.replace(/[\(\)]/g, ''));
        return calculate(expression.replace(unit, +result));
    }
}

const finder = (expr, type) => {
    let regex = new RegExp(`(?:(?:[\\d\\.]\\-)?)(?<found>\\-?[\\d\\.]+(?:e[\\-\\+]\\d*)?\\${type}\\-?[\\d\\.]+(?:e[\\-\\+]\\d*)?)`);
    const result = regex.exec(expr);
    return result ? result.groups.found : undefined;
}

const calc = (expression, type = 0) => {
    const types = ['/', '*', '-', '+'];
    let result = finder(expression, types[type]);
    if (result) {
        const regex = new RegExp(`(?:(?:[\\d\\.]+\\-)?)(?<first>\\-?[\\d\\.]+(?:e[\\-\\+]\\d*)?)\\${types[type]}(?<second>\\-?[\\d\\.]+(?:e[\\-\\+]\\d*)?)`);
        let { groups: { first, second } } = regex.exec(result);//
        if (type === 0 && second == 0) throw new Error(`TypeError: Division by zero.`);
        expression = expression.replace(result, sss(Number.parseFloat(first), Number.parseFloat(second), types[type]));
        return calc(expression.replace(/\-{2}/g, '+'), type)
    } else {
        return type === 3 ? expression : calc(expression, ++type);
    }
}

const sss = (a, b, type) => {
    if (type === '/') { return a / b; }
    if (type === '*') { return a * b; }
    if (type === '-') { return a - b; }
    if (type === '+') { return a + b; }
}

function checker(str, marker = false) {
    const found = /\(\)/gm.exec(str);
    marker = found === null ? false : true;

    if (marker) {
        let array = found.input.split('');
        array.splice(found.index, found[0].length);
        str = array.join('');
        return str.length > 0 ? checker(str, marker) : marker;
    } else {
        return marker;
    }
}

module.exports = {
    expressionCalculator
}

