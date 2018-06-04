'use strict';

const _ = require('lodash');

exports.name = 'getOperators';
exports.path = 'expression.node.Node.prototype';
exports.factory = function(){
  return function(){
    let operators = [];
    this.traverse(function(node){
      if(node.isOperatorNode){
        operators.push(node.op);
      }
    });

    return _.uniq(operators);
  };
};
