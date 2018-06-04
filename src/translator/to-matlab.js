'use strics';

const _ = require('lodash');

exports.name = 'matlab';
exports.path = 'expression.translator.to';
exports.factory = function(){
  return {
    'functionName': {
      pow: 'power',
      min: function(expression){
        let array = new expression.node.ArrayNode(this.args);
        this.args = [array];
        return this;
      },
      max: function(expression){
        let array = new expression.node.ArrayNode(this.args);
        this.args = [array];
        return this;
      },
      log: function(expression){
        if(this.args.length===1){
          return this;
        }else{
          let first = new expression.node.FunctionNode('log', [this.args[0]]);
          let second = new expression.node.FunctionNode('log', [this.args[1]]);
          return new expression.node.OperatorNode('/', 'divide', [first, second]);
        }
      }
    },
    'symbolName': {
      'PI': 'pi',
      'e': function(expression){
        let value = new expression.node.ConstantNode(1);
        return new expression.node.FunctionNode('exp', [value]);
      },
      'E': function(expression){
        let value = new expression.node.ConstantNode(1);
        return new expression.node.FunctionNode('exp', [value]);
      },
    },
    'constant': function(expression){
      if(this.value===Infinity){
        return new expression.node.SymbolNode('Inf');
      }else{
        return this;
      }
    },
    'conditionalType': {
      larger: function(expression){
        if(!_.has(this, 'condition.content'))
          throw new Error('For Matlab condition must be in brackets.');
        let x1 = this.condition.content.args[0]; // TODO: 'content' means that condition in bracket
        let x2 = this.condition.content.args[1];
        let y1 = this.trueExpr;
        let y2 = this.falseExpr;
        return new expression.node.FunctionNode('fun.ifgt', [x1,x2,y1,y2]);
      },
      largerEq: function(expression){
        if(!_.has(this, 'condition.content'))
          throw new Error('For Matlab condition must be in brackets.');
        let x1 = this.condition.content.args[0]; // TODO: 'content' means that condition in bracket
        let x2 = this.condition.content.args[1];
        let y1 = this.trueExpr;
        let y2 = this.falseExpr;
        return new expression.node.FunctionNode('fun.ifge', [x1,x2,y1,y2]);
      },
      smallerEq: function(expression){
        if(!_.has(this, 'condition.content'))
          throw new Error('For Matlab condition must be in brackets.');
        let x1 = this.condition.content.args[0]; // 'content' means that condition in bracket
        let x2 = this.condition.content.args[1];
        let y1 = this.trueExpr;
        let y2 = this.falseExpr;
        return new expression.node.FunctionNode('fun.ifle', [x1,x2,y1,y2]);
      },
      smaller: function(expression){
        if(!_.has(this, 'condition.content'))
          throw new Error('For Matlab condition must be in brackets.');
        let x1 = this.condition.content.args[0]; // 'content' means that condition in bracket
        let x2 = this.condition.content.args[1];
        let y1 = this.trueExpr;
        let y2 = this.falseExpr;
        return new expression.node.FunctionNode('fun.iflt', [x1,x2,y1,y2]);
      },
      equal: function(expression){
        if(!_.has(this, 'condition.content'))
          throw new Error('For Matlab condition must be in brackets.');
        let x1 = this.condition.content.args[0]; // 'content' means that condition in bracket
        let x2 = this.condition.content.args[1];
        let y1 = this.trueExpr;
        let y2 = this.falseExpr;
        return new expression.node.FunctionNode('fun.ifeq', [x1,x2,y1,y2]);
      }
    }
  };
};
