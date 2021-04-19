'use strict';

exports.name = 'getFunctions';
exports.path = 'expression.node.Node.prototype';
exports.factory = function(){
  return function(){
    let functionNames = this.filter((node, path, parent) => {
      return node.isFunctionNode;
    }).reduce((acc, node) => {
      if (acc.indexOf(node.name) === -1) acc.push(node.name)
      return acc
    }, []);

    return functionNames;
  };
};
