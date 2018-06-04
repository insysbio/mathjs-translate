'use strict';

// const _ = require('../lodash');

exports.name = 'dbsolve';
exports.path = 'expression.translator.from';
exports.factory = function(){
  return {
    'functionName':{
      'ln': 'log',
      'fabs': 'abs',
      'min2': 'min',
      'min3': 'min',
      'max2': 'max',
      'max3': 'max',
      'ifgt': function(expression){
        let [x1, x2, trueExpr, falseExpr] = this.args;
        let condition = new expression.node.OperatorNode('>', 'larger', [x1, x2]);
        return new expression.node.ConditionalNode(condition, trueExpr, falseExpr);
      },
      'ifge': function(expression){
        let [x1, x2, trueExpr, falseExpr] = this.args;
        let condition = new expression.node.OperatorNode('>=', 'largerEq', [x1, x2]);
        return new expression.node.ConditionalNode(condition, trueExpr, falseExpr);
      },
      'ifle': function(expression){
        let [x1, x2, trueExpr, falseExpr] = this.args;
        let condition = new expression.node.OperatorNode('<=', 'smallerEq', [x1, x2]);
        return new expression.node.ConditionalNode(condition, trueExpr, falseExpr);
      },
      'iflt': function(expression){
        let [x1, x2, trueExpr, falseExpr] = this.args;
        let condition = new expression.node.OperatorNode('<', 'smaller', [x1, x2]);
        return new expression.node.ConditionalNode(condition, trueExpr, falseExpr);
      },
      'ifeq': function(expression){
        let [x1, x2, trueExpr, falseExpr] = this.args;
        let condition = new expression.node.OperatorNode('==', 'equal', [x1, x2]);
        return new expression.node.ConditionalNode(condition, trueExpr, falseExpr);
      }
    },
    'symbolName': {}
  };
};
