'use strict';

const _ = require('lodash');

exports.name = 'getFunctions';
exports.path = 'expression.node.Node.prototype';
exports.factory = function(){
  return function(){
    let functions = [];
    this.traverse(function(node){
      if(node.isFunctionNode){
        functions.push(node.name);
      }
    });

    return _.uniq(functions);
  };
};
