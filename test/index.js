/* global describe, it */
'use strict';

let math = require('mathjs');
math.import(require('../src/index'));

const assert = require('assert');

let examp1 = 'x*exp(y)/log(z/g)*1.32 + max(1.22, 3.3) + fun1(x,y,z)';
describe('Test getSomething for expression: ' + examp1, function(){
  let parsed = math.parse(examp1);

  it('getSymbols:', () => {
    assert.deepEqual(
      parsed.getSymbols(),
      ['x', 'y', 'z', 'g']
    );
  });

  it('getSymbols for "x":', () => {
    assert.deepEqual(math.parse('x').getSymbols(), ['x']);
  });

  it('getSymbols for "-x":', () => {
    assert.deepEqual(math.parse('-x').getSymbols(), ['x']);
  });

  it('getConstants:', () => {
    assert.deepEqual(
      parsed.getConstants(),
      [1.32, 1.22, 3.3]
    );
  });

  it('getFunctions:', () => {
    assert.deepEqual(
      parsed.getFunctions(),
      ['exp', 'log', 'max', 'fun1']
    );
  });

  it('getOperators:', () => {
    assert.deepEqual(
      parsed.getOperators(),
      ['+', '*', '/']
    );
  });
});

let examp2 = 'a*b*c+d + fun1(a,b) + fun2(fun3(z)) + fun3(d)';
let examp_operators = 'x^(y*z) + (x*y)^z + x^y';
describe('Test translation of expression: ' + examp2, () => {
  it('Translate symbols', () => {
    let parsed = math.parse(examp2);
    let translator = {
      symbolName: {
        a: 'x',
        b: 'y',
        c: 'z'
      }
    };
    assert.equal(
      parsed.translate(translator).toString(),
      'x * y * z + d + fun1(x, y) + fun2(fun3(z)) + fun3(d)'
    );
  });

  it('Translate functions', () => {
    let parsed = math.parse(examp2);
    let translator = {
      functionName: {
        fun1: function() {
          this.args = [this.args[1], this.args[0]];
          this.fn.name = 'log';
          return this;
        },
        fun2: 'exp',
        fun3: 'sin'
      }
    };
    assert.equal(
      parsed.translate(translator).toString(),
      'a * b * c + d + log(b, a) + exp(sin(z)) + sin(d)'
    );
  });

  it('Translate operators: ' + examp_operators, () => {
    let parsed = math.parse(examp_operators);
    let translator = {
      operatorName: {
        'pow': function(expression) {
          return new expression.node.FunctionNode('pow', this.args);
        }
      }
    };
    assert.equal(
      parsed.translate(translator).toString(),
      'pow(x, (y * z)) + pow((x * y), z) + pow(x, y)'
    );
  });
});

let examp3 = 'a*exp(-0.5*b) + ln(c) + fabs(d) + max2(x,y) + min2(x,y) + max3(x,y,z) + min3(x,y,z)';
let examp3_tern = 'ifgt(x,y,1,2) + ifge(x,y,1,2) + ifle(x,y,1,2) + iflt(x,y,1,2) + ifeq(x,y,1,2) + ifgt(1, 2, ifgt(1,2,x,y), y*y)';
let examp4 = 'a*exp(-0.5*b) + log(c) + abs(d) + max(x,y) + min(x,y) + max(x,y,z) + min(x,y,z) + pi + PI + e + E + Infinity - Infinity';
let examp4_tern1 = '((x > y) ? 1 : 2) + ((x >= y) ? 1 : 2) + ((x <= y) ? 1 : 2) + ((x < y) ? 1 : 2) + ((x == y) ? 1 : 2)';
let examp4_tern2 = '(1 > 2) ? ((1 > 2) ? x : y) : (y * y)';
let examp4_log = 'log(x*y, z*2)';

describe('Test translation "dbsolve".', () => {
  it('Translate from "dbsolve": ' + examp3, () => {
    let parsed = math.parse(examp3);
    assert.equal(
      parsed.translate(math.expression.translator.from.dbsolve).toString(),
      'a * exp(-0.5 * b) + log(c) + abs(d) + max(x, y) + min(x, y) + max(x, y, z) + min(x, y, z)'
    );
  });

  it('Translate ternary from "dbsolve": ' + examp3_tern, () => {
    let parsed = math.parse(examp3_tern);
    assert.equal(
      parsed.translate(math.expression.translator.from.dbsolve).toString(),
      '((x > y) ? 1 : 2) + ((x >= y) ? 1 : 2) + ((x <= y) ? 1 : 2) + ((x < y) ? 1 : 2) + ((x == y) ? 1 : 2) + ((1 > 2) ? ((1 > 2) ? x : y) : (y * y))'
    );
  });

  it('Translate to "dbsolve": ' + examp4, () => {
    let parsed = math.parse(examp4);
    assert.equal(
      parsed.translate(math.expression.translator.to.dbsolve).toString(),
      'a * exp(-0.5 * b) + log(c) + abs(d) + max2(x, y) + min2(x, y) + max3(x, y, z) + min3(x, y, z) + 3.141592653589793 + 3.141592653589793 + exp(1) + exp(1) + 1e+38 - 1e+38'
    );
  });

  it('Translate ternary to "dbsolve": ' + examp4_tern1, () => {
    let parsed = math.parse(examp4_tern1);
    assert.equal(
      parsed.translate(math.expression.translator.to.dbsolve).toString(),
      '(ifgt(x, y, 1, 2)) + (ifge(x, y, 1, 2)) + (ifle(x, y, 1, 2)) + (iflt(x, y, 1, 2)) + (ifeq(x, y, 1, 2))'
    );
  });

  it('Translate ternary without brackets to "dbsolve": ' + examp4_tern2, () => {
    let parsed = math.parse(examp4_tern2);
    // console.log(JSON.stringify(parsed, null, 4));
    assert.equal(
      parsed.translate(math.expression.translator.to.dbsolve).toString(),
      'ifgt(1, 2, (ifgt(1, 2, x, y)), (y * y))'
    );
  });

  it('Translate log with two arguments to "dbsolve": ' + examp4_log, () => {
    let parsed = math.parse(examp4_log);
    assert.equal(
      parsed.translate(math.expression.translator.to.dbsolve).toString(),
      'log(x * y) / log(z * 2)'
    );
  });

});

let examp5 = 'a*b + pow(c,d) + PI + pi + e + Infinity + E + t + min(x1,x2,x3) + max(x1,x2,x3) + log(x) + log(x,b)';
let examp5_tern = '((x > y) ? 1 : 2) + ((x >= y) ? 1 : 2) + ((x <= y) ? 1 : 2) + ((x < y) ? 1 : 2) + ((x == y) ? 1 : 2)';

describe('Test translation "matlab".', () => {
  it('Translate to "matlab": ' + examp5, () => {
    let parsed = math.parse(examp5);
    assert.equal(
      parsed.translate(math.expression.translator.to.matlab).toString(),
      'a * b + power(c, d) + pi + pi + exp(1) + Inf + exp(1) + t + min([x1, x2, x3]) + max([x1, x2, x3]) + log(x) + log(x) / log(b)'
    );
  });

  it('Translate ternary to "matlab": ' + examp5_tern, () => {
    let parsed = math.parse(examp5_tern);
    assert.equal(
      parsed.translate(math.expression.translator.to.matlab).toString(),
      '(fun.ifgt(x, y, 1, 2)) + (fun.ifge(x, y, 1, 2)) + (fun.ifle(x, y, 1, 2)) + (fun.iflt(x, y, 1, 2)) + (fun.ifeq(x, y, 1, 2))'
    );
  });
});

let examp6 = 'NaN + pow(c,d) + PI + pi + e + Infinity + E + t + min(x1,x2,x3) + max(x1,x2,x3) + log(x) + log(x,b)';
let examp6_tern = '((x > y) ? 1 : 2) + ((x >= y) ? 1 : 2) + ((x <= y) ? 1 : 2) + ((x < y) ? 1 : 2) + ((x == y) ? 1 : 2)';

describe('Test translation "julia".', () => {
  it('Translate to "julia": ' + examp6, () => {
    let parsed = math.parse(examp6);
    assert.equal(
      parsed.translate(math.expression.translator.to.julia).toString(),
      'NaN + c ^ d + pi + pi + e + Inf + e + t + min(x1, x2, x3) + max(x1, x2, x3) + log(x) + log(b, x)'
    );
  });

  it('Translate ternary to "julia": ' + examp6_tern, () => {
    let parsed = math.parse(examp6_tern);
    assert.equal(
      parsed.translate(math.expression.translator.to.julia).toString(),
      '((x > y) ? 1 : 2) + ((x >= y) ? 1 : 2) + ((x <= y) ? 1 : 2) + ((x < y) ? 1 : 2) + ((x == y) ? 1 : 2)'
    );
  });
});

// console.log(math.parse('x^y'));
