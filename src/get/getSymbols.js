'use strict';

const _ = require('../lodash');

exports.name = 'getSymbols';
exports.path = 'expression.node.Node.prototype';
exports.factory = function(){
  return function(){
    //console.log(JSON.stringify(this, null, 2));
    let symbols = [];
    this.traverse(function(node){
      if(node.args){
        node.args
          .filter((arg) => arg.isSymbolNode)
          .forEach((arg) => symbols.push(arg.name));
      }
    });

    return _.uniq(symbols);
  };
};
