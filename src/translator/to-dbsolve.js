'use strict';

const _ = require('../lodash');

exports.name = 'dbsolve';
exports.path = 'expression.translator.to';
exports.factory = function(){
  return {
    'functionName': {
      min: function(){
        if(this.args.length > 1 && this.args.length < 4){
          this.fn.name = 'min' + this.args.length;
        }else{
          throw new Error('Min arguments count in DBSolve must be 2 or 3');
        }
        return this;
      },
      max: function(){
        if(this.args.length > 1 && this.args.length < 4){
          this.fn.name = 'max' + this.args.length;
        }else{
          throw new Error('Max arguments count in DBSolve must be 2 or 3');
        }
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
      'pi': function(expression){
        // const ConstantNode = load(require('mathjs/lib/expression/node/ConstantNode'));
        return new expression.node.ConstantNode(3.141592653589793);
      },
      'PI': function(expression){
        return new expression.node.ConstantNode(3.141592653589793);
      },
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
        return new expression.node.ConstantNode(1e38);
      }else{
        return this;
      }
    },
    'conditionalType': {
      larger: function(expression){
        if(!_.has(this, 'condition.content'))
          throw new Error('For DBSolve condition must be in brackets.');
        let x1 = this.condition.content.args[0]; // XXX: 'content' means that condition in bracket
        let x2 = this.condition.content.args[1];
        let y1 = this.trueExpr;
        let y2 = this.falseExpr;
        return new expression.node.FunctionNode('ifgt', [x1,x2,y1,y2]);
      },
      largerEq: function(expression){
        if(!_.has(this, 'condition.content'))
          throw new Error('For DBSolve condition must be in brackets.');
        let x1 = this.condition.content.args[0]; // 'content' means that condition in bracket
        let x2 = this.condition.content.args[1];
        let y1 = this.trueExpr;
        let y2 = this.falseExpr;
        return new expression.node.FunctionNode('ifge', [x1,x2,y1,y2]);
      },
      smallerEq: function(expression){
        if(!_.has(this, 'condition.content'))
          throw new Error('For DBSolve condition must be in brackets.');
        let x1 = this.condition.content.args[0]; // 'content' means that condition in bracket
        let x2 = this.condition.content.args[1];
        let y1 = this.trueExpr;
        let y2 = this.falseExpr;
        return new expression.node.FunctionNode('ifle', [x1,x2,y1,y2]);
      },
      smaller: function(expression){
        if(!_.has(this, 'condition.content'))
          throw new Error('For DBSolve condition must be in brackets.');
        let x1 = this.condition.content.args[0]; // 'content' means that condition in bracket
        let x2 = this.condition.content.args[1];
        let y1 = this.trueExpr;
        let y2 = this.falseExpr;
        return new expression.node.FunctionNode('iflt', [x1,x2,y1,y2]);
      },
      equal: function(expression){
        if(!_.has(this, 'condition.content'))
          throw new Error('For DBSolve condition must be in brackets.');
        let x1 = this.condition.content.args[0]; // 'content' means that condition in bracket
        let x2 = this.condition.content.args[1];
        let y1 = this.trueExpr;
        let y2 = this.falseExpr;
        return new expression.node.FunctionNode('ifeq', [x1,x2,y1,y2]);
      }
    }
  };
};
