'use strict';

const _ = require('../lodash');

exports.name = 'getSymbols';
exports.path = 'expression.node.Node.prototype';
exports.factory = function(){
  return function(){
    //console.log(JSON.stringify(this, null, 2));
    let symbols = [];
    this.traverse(function(node, path){
      if(node.isSymbolNode && path!=='fn'){
        symbols.push(node.name);
      }
    });

    return _.uniq(symbols);
  };
};
