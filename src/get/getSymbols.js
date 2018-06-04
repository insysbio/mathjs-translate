'use strict';

const _ = require('lodash');

exports.name = 'getSymbols';
exports.path = 'expression.node.Node.prototype';
exports.factory = function(){
  return function(){
    // console.log(JSON.stringify(this));
    let symbols = [];
    this.traverse(function(node){
      if(node.isSymbolNode){
        symbols.push(node.name);
      }
    });

    return _.uniq(symbols);
  };
};
