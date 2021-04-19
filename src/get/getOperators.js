'use strict';

exports.name = 'getOperators';
exports.path = 'expression.node.Node.prototype';
exports.factory = function(){
  return function(){
    let operatorNames = this.filter((node, path, parent) => {
      return node.isOperatorNode;
    }).reduce((acc, node) => {
      if (acc.indexOf(node.op) === -1) acc.push(node.op)
      return acc
    }, []);

    return operatorNames;
  };
};
