# mathjs-translate
Utilites for manipulation of mathjs http://mathjs.org/ expressions.

## Installation

```
npm install mathjs-translate
```

## Usage

```javascript
const math = require('mathjs');
math.import(require('mathsjs-translate'));

// translations
let matlabExpr = math
    .parse('min(x1,x2,x3) + log(x,b)')
    .translate(math.expression.translate.to.matlab)
    .toString();
console.log(matlabExpr);
// min([x1, x2, x3]) + log(x) / log(b)

// get
let functions = math
    .parse('min(x1,x2,x3) + log(x,b)')
    .getFunctions();
console.log(functions);
// ['min', 'log']
```

## Browser

Browser version located in /dist

## Structure of translator

```javascript
let translator = {
    functionName: {
        exp: "exp1", // change name
        log: function(expression){ // change by function
            ...
            return node;
        }
    },
    symbolName: {
        x: "x1", // change name
        y: function(expression){ // change by function
            ...
            return node;
        }
    },
    operatorName: {
        pow: "pow1", // change name
        add: function(expression){ // change by function
            ...
            return node;
        }
    },
    constant: function(expression){ // change by function
        ...
        return node;
    },
    conditionalType: {
        larger: function(expression){ // change by function
            ...
            return node;
        }
    }
};
```


## Author

 - Evgeny Metelkin @metelkin

## Copyright

InSysBio, Moscow, 2017-2018
http://insysbio.com
