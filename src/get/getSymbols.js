'use strict';

exports.name = 'getSymbols';
exports.path = 'expression.node.Node.prototype';
exports.factory = function(){
  return function(){
    let symbolNames = this.filter((node, path, parent) => {
      return node.isSymbolNode && path!=='fn';
    }).reduce((acc, node) => {
      if (acc.indexOf(node.name) === -1) acc.push(node.name)
      return acc
    }, []);

    return symbolNames;
  };
};
