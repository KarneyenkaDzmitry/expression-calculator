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
    if (!check(expression.replace(/[+\-*\/\d\s]/g, ''), [['(', ')']])) throw new Error(`ExpressionError: Brackets must be paired`);
    return expression;
}

function calculate(expression) {
    if (/^\-?[\d\.]+(?:e[\-\+]\d*)?$/.test(expression)) {
        return +expression;
    } else {
        const unit = /(\([\s\*\-\+\.\/\d]+\))/.exec(expression);
        let result = division(unit[0].replace(/[\(\)]/g, ''));
        return calculate(expression.replace(unit[0], +result));
    }
}

function division(expression) {
    let result = /(?:(?:[\d\.]+\-)?)(\-?[\d\.]+(?:e[\-\+]\d*)?\/\-?[\d\.]+(?:e[\-\+]\d*)?)/.exec(expression)
    if (result) {

        const [, first, second,] = /(?:\d+\-)?(\-?[\d\.]+(?:e[\-\+]\d*)?)\/(\-?[\d\.]+(?:e[\-\+]\d*)?)/g.exec(result[1]);
        if (second == 0) throw new Error(`TypeError: Devision by zero.`);
        return division(expression.replace(result[1], Number.parseFloat(first) / Number.parseFloat(second)))
    } else {
        return multiplication(expression);
    }
}

function summation(expression) {
    let result = /\-?[\d\.]+(?:e[\-\+]\d*)?\+\-?[\d\.]+(?:e[\-\+]\d*)?/.exec(expression)
    if (result) {
        const [, first, second,] = /(?:\d+\-)?(\-?[\d\.]+(?:e[\-\+]\d*)?)\+(\-?[\d\.]+(?:e[\-\+]\d*)?)/g.exec(result[0]);
        return summation(expression.replace(result[0], Number.parseFloat(first) + Number.parseFloat(second)));
    } else {
        return expression;
    }
}

function multiplication(expression) {
    let result = /(?:(?:[\d\.]+\-)?)(\-?[\d\.]+(?:e[\-\+]\d*)?\*\-?[\d\.]+(?:e[\-\+]\d*)?)/.exec(expression)
    if (result) {
        let { groups: { first, second } } = /(?:(?:[\d\.]+\-)?)(?<first>\-?[\d\.]+(?:e[\-\+]\d*)?)\*(?<second>\-?[\d\.]+(?:e[\-\+]\d*)?)/.exec(result[1]);//
        return multiplication(expression.replace(result[1], Number.parseFloat(first) * Number.parseFloat(second)));
    } else {
        return subtraction(expression);
    }
}

function subtraction(expression) {
    let result = /\-?[\d\.]+(?:e[\-\+]\d*)?\-\-?[\d\.]+(?:e[\-\+]\d*)?/.exec(expression)
    if (result) {
        const [, first, second,] = /(?:\d+\-)?(\-?[\d\.]+(?:e[\-\+]\d*)?)\-(\-?[\d\.]+(?:e[\-\+]\d*)?)/g.exec(result[0]);
        return subtraction(expression.replace(result[0], Number.parseFloat(first) - Number.parseFloat(second)));
    } else {
        return summation(expression);
    }
}

function check(str, bracketsConfig) {
    return checker(str, bracketsConfig);
}

function checker(str, conf, marker = false) {
    const regex = RegExp(conf.map(([start, end]) => `${/\||(\{|\}|\[|\]|\(|\))/gm.test(start) ? '\\' + start : start}${/(\||\{|\}|\[|\]|\(|\))/gm.test(end) ? '\\' + end : end}`).join('|'));
    const found = regex.exec(str);
    marker = found === null ? false : true;

    if (marker) {
        let array = found.input.split('');
        array.splice(found.index, found[0].length);
        str = array.join('');
        return str.length > 0 ? checker(str, conf, marker) : marker;
    } else {
        return marker;
    }
}
module.exports = {
    expressionCalculator
}