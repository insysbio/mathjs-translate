'use strict';

// const _ = require('../lodash');

exports.name = 'getConstants';
exports.path = 'expression.node.Node.prototype';
exports.factory = function(){
  return function(){
    let constants = [];
    this.traverse(function(node){
      if(node.isConstantNode){
        constants.push(node.value);
      }
    });

    return constants;
  };
};
